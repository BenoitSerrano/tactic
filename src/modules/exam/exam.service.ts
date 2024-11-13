import { In, IsNull, Not } from 'typeorm';
import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { examAdaptator } from './exam.adaptator';
import { User } from '../user';
import { buildStudentService } from '../student';
import { mapEntities } from '../../lib/mapEntities';
import { Question, buildQuestionService } from '../question';
import { buildExerciseService } from '../exercise';
import { examEdgeTextKind } from './types';
import { Establishment } from '../establishment';
import { buildClasseService, Classe } from '../classe';
import { sortExamsByDateTime } from './lib/sortExamsByDateTime';
import { buildEstablishmentService } from '../establishment/establishment.service';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        updateExamName,
        updateExamDuration,
        updateExamEdgeText,
        getExamsByClasse,
        getExams,
        getExamsByUser,
        getExamWithQuestions,
        getAllExams,
        getExam,
        getExamWithoutAnswers,
        getExamQuestions,
        getExamsByIds,
        getUserIdForExam,
        deleteExam,
        getExamResults,
        duplicateExam,
        fetchShouldDisplayRightAnswersForExamId,
        updateShouldDisplayRightAnswersForExamId,
        countExamsForUser,
        updateClasseId,
        updateExamDateTimeRange,
    };

    return examService;

    async function updateClasseId(criteria: { examId: Exam['id'] }, classeId: Classe['id']) {
        const result = await examRepository.update(
            { id: criteria.examId },
            { classe: { id: classeId } },
        );
        if (result.affected !== 1) {
            throw new Error(`Could not update classe Id for exam ${criteria.examId}`);
        }
        return true;
    }

    async function createExam(params: {
        name: Exam['name'];
        duration: number | null;
        classeId: Classe['id'];
        user: User;
        startDateTime: number;
        endDateTime: number | null;
    }) {
        const classeService = buildClasseService();
        const exam = new Exam();
        exam.name = params.name;
        exam.duration = params.duration !== null ? params.duration : null;
        exam.classe = await classeService.getClasse(params.classeId);
        exam.user = params.user;
        exam.startTime = new Date(params.startDateTime).toISOString();
        exam.endTime =
            params.endDateTime === null ? null : new Date(params.endDateTime).toISOString();
        exam.startText = params.user.userConfiguration.defaultStartText;
        exam.endText = params.user.userConfiguration.defaultEndText;
        const insertedExam = await examRepository.save(exam);
        return insertedExam;
    }

    async function updateExamName(examId: Exam['id'], name: string) {
        const exam = await examRepository.findOneOrFail({ where: { id: examId } });
        exam.name = name;
        const newExam = await examRepository.save(exam);
        return newExam;
    }

    async function updateExamEdgeText(examId: Exam['id'], kind: examEdgeTextKind, text: string) {
        const exam = await examRepository.findOneOrFail({ where: { id: examId } });
        switch (kind) {
            case 'start':
                exam.startText = text;
                break;
            case 'end':
                exam.endText = text;
                break;
        }
        const newExam = await examRepository.save(exam);
        return newExam;
    }

    async function updateExamDuration(examId: Exam['id'], duration: number | null) {
        const exam = await examRepository.findOneOrFail({ where: { id: examId } });
        exam.duration = duration !== null ? duration : null;
        const newExam = await examRepository.save(exam);
        return newExam;
    }

    async function getExam(examId: Exam['id']) {
        return examRepository.findOneOrFail({ where: { id: examId } });
    }

    async function getExamWithQuestions(examId: Exam['id']) {
        const questionService = buildQuestionService();
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                exercises: {
                    id: true,
                    name: true,
                    instruction: true,
                    defaultPoints: true,
                    defaultQuestionKind: true,
                    order: true,
                    questions: { id: true, order: true },
                },
            },
            order: { exercises: { order: 'ASC', questions: { order: 'ASC' } } },
            relations: ['exercises', 'exercises.questions'],
        });
        const questionIds: Question['id'][] = [];
        for (const exercise of exam.exercises) {
            for (const question of exercise.questions) {
                questionIds.push(question.id);
            }
        }

        const questions = await questionService.getQuestions(questionIds);

        return {
            ...exam,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map(({ id }) => questions[id]),
            })),
        };
    }

    async function getExamWithoutAnswers(examId: Exam['id']) {
        const exam = await getExamQuestions(examId);
        return {
            ...exam,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map((question) => ({
                    id: question.id,
                    kind: question.kind,
                    title: question.title,
                    possibleAnswers: question.possibleAnswers,
                    points: question.points,
                    currentAnswer: '',
                })),
            })),
        };
    }

    async function getExamsByClasse(criteria: {
        establishmentId: Establishment['id'];
        classeId: Classe['id'];
        userId: User['id'];
    }) {
        const exams = await examRepository.find({
            where: {
                classe: { id: criteria.classeId },
            },
            relations: ['classe'],
            select: { classe: { id: true } },
            order: { startTime: 'DESC' },
        });

        return sortExamsByDateTime(exams);
    }

    async function getExams(criteria: { userId: User['id'] }) {
        const establishmentService = buildEstablishmentService();
        const examIds = await establishmentService.getExamIdsByUser(criteria.userId);
        const exams = await examRepository.find({
            where: {
                id: In(examIds),
            },
            order: { startTime: 'DESC' },
        });

        return sortExamsByDateTime(exams);
    }

    async function getExamsByUser(userId: User['id']) {
        return examRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async function getUserIdForExam(examId: Exam['id']): Promise<User['id']> {
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: { id: true, user: { id: true } },
            relations: ['user'],
        });
        return exam.user.id;
    }

    async function getExamsByIds(examIds: Array<Exam['id']>) {
        const exams = await examRepository.find({
            where: { id: In(examIds) },
            order: { createdAt: 'ASC' },
            select: { id: true, name: true, duration: true, extraTime: true, createdAt: true },
        });

        return mapEntities(exams);
    }

    async function getExamQuestions(examId: string) {
        const questionService = buildQuestionService();
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            order: {
                exercises: { order: 'ASC', questions: { order: 'ASC' } },
            },
            relations: ['exercises', 'exercises.questions'],
        });

        return {
            ...exam,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map((question) =>
                    questionService.decodeQuestion(question),
                ),
            })),
        };
    }

    async function getExamResults(examId: string) {
        const studentService = buildStudentService();
        const questionService = buildQuestionService();

        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                id: true,
                name: true,
                duration: true,
                extraTime: true,
                exercises: { id: true, questions: { id: true } },
            },
            relations: ['exercises', 'exercises.questions'],
        });
        const examWithAttempts = await examRepository.findOneOrFail({
            where: { id: examId },
            select: {
                attempts: {
                    id: true,
                    startedAt: true,
                    updatedAt: true,
                    student: { id: true },
                    roundTrips: true,
                    timeSpentOutside: true,
                    manualMarks: true,
                    answers: true,
                    endedAt: true,
                    correctedAt: true,
                },
            },
            relations: ['attempts', 'attempts.student'],
        });

        const studentIds = examWithAttempts.attempts.map((attempt) => attempt.student.id);
        const students = await studentService.getStudents(studentIds);

        const questionIds: Question['id'][] = [];
        for (const exercise of exam.exercises) {
            questionIds.push(...exercise.questions.map((question) => question.id));
        }
        const questions = await questionService.getQuestions(questionIds);

        const examWithResults = examAdaptator.convertExamWithAttemptsToResults(
            examWithAttempts.attempts,
            students,
            { name: exam.name, duration: exam.duration, extraTime: exam.extraTime, questions },
        );

        return examWithResults;
    }

    async function deleteExam(examId: string) {
        const examRepository = dataSource.getRepository(Exam);

        const result = await examRepository.delete({ id: examId });
        return result.affected == 1;
    }

    async function getAllExams() {
        const exams = await examRepository.find({
            select: { user: { id: true } },
            relations: ['exercises', 'exercises.questions', 'user'],
        });

        return exams;
    }

    async function duplicateExam(criteria: { examId: Exam['id']; user: User }) {
        const exerciseService = buildExerciseService();
        const { id, exercises, attempts, ...partialExam } = await examRepository.findOneOrFail({
            where: { id: criteria.examId, user: { id: criteria.user.id } },
            relations: ['exercises', 'exercises.questions', 'user'],
        });

        const result = await examRepository.insert({
            ...partialExam,
            name: `Copie de ${partialExam.name}`,
        });
        const newExamId = result.identifiers[0].id;
        const newExam = await examRepository.findOneOrFail({ where: { id: newExamId } });
        await exerciseService.duplicateExercises(newExam, exercises);

        return newExam;
    }

    async function fetchShouldDisplayRightAnswersForExamId(examId: Exam['id']) {
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: { shouldDisplayRightAnswers: true },
        });
        return { shouldDisplayRightAnswers: exam.shouldDisplayRightAnswers };
    }
    async function updateShouldDisplayRightAnswersForExamId(
        examId: Exam['id'],
        newShouldDisplayRightAnswers: boolean,
    ) {
        await examRepository.update(
            { id: examId },
            { shouldDisplayRightAnswers: newShouldDisplayRightAnswers },
        );
        return true;
    }

    async function countExamsForUser(user: User) {
        const examCount = await examRepository.count({ where: { user: { id: user.id } } });
        return examCount;
    }

    async function updateExamDateTimeRange(
        examId: Exam['id'],
        params: { startDateTime: number; endDateTime: number | null },
    ) {
        const startTime = new Date(params.startDateTime).toISOString();
        const endTime =
            params.endDateTime === null ? null : new Date(params.endDateTime).toISOString();
        const result = await examRepository.update({ id: examId }, { startTime, endTime });
        if (result.affected !== 1) {
            throw new Error(`Could not update exam ${examId}`);
        }
        return true;
    }
}
