import { In, IsNull, Not } from 'typeorm';
import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { examAdaptator } from './exam.adaptator';
import { User } from '../user';
import { buildStudentService } from '../student';
import { mapEntities } from '../../lib/mapEntities';
import { Question, buildQuestionService } from '../question';
import { buildExerciseService } from '../exercise';
import { examEdgeTextKind, examFilterType } from './types';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        updateExamName,
        updateExamDuration,
        updateExamEdgeText,
        getExams,
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
        updateExamArchivedAt,
        fetchShouldDisplayRightAnswersForExamId,
        updateShouldDisplayRightAnswersForExamId,
        countExamsForUser,
    };

    return examService;

    async function createExam(name: Exam['name'], duration: number | null, user: User) {
        const exam = new Exam();
        exam.name = name;
        exam.duration = duration !== null ? duration : null;
        exam.user = user;
        exam.startText = user.userConfiguration.defaultStartText;
        exam.endText = user.userConfiguration.defaultEndText;
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

    async function getExams(criteria: { filter: examFilterType }, user: User) {
        return examRepository.find({
            where: { user, archivedAt: getArchivedWhereFilter() },
            order: { createdAt: 'DESC' },
        });

        function getArchivedWhereFilter() {
            switch (criteria.filter) {
                case 'current':
                    return IsNull();
                case 'archived':
                    return Not(IsNull());
            }
        }
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
            relations: ['exercises', 'exercises.questions'],
        });

        return exams;
    }

    async function duplicateExam(criteria: { examId: Exam['id']; user: User }) {
        const exerciseService = buildExerciseService();
        const { id, exercises, attempts, ...partialExam } = await examRepository.findOneOrFail({
            where: { id: criteria.examId, user: criteria.user },
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

    async function updateExamArchivedAt(examId: Exam['id'], archive: boolean) {
        if (archive) {
            await examRepository.update({ id: examId }, { archivedAt: () => 'CURRENT_TIMESTAMP' });
        } else {
            await examRepository.update({ id: examId }, { archivedAt: null });
        }
        return true;
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
        const examCount = await examRepository.count({ where: { user } });
        return examCount;
    }
}
