import { Exam } from './Exam.entity';
import { dataSource } from '../../dataSource';
import { examAdaptator } from './exam.adaptator';
import { User } from '../user';
import { buildStudentService } from '../student';
import { mapEntities } from '../../lib/mapEntities';
import { Question, buildQuestionService } from '../question';
import { In } from 'typeorm';
import { computeSumPoints } from './lib/computeSumPoints';
import { buildExerciseService } from '../exercise';

export { buildExamService };

function buildExamService() {
    const examRepository = dataSource.getRepository(Exam);
    const examService = {
        createExam,
        updateExamName,
        updateExamDuration,
        getExams,
        getAllExams,
        getExam,
        getExamExercises,
        getExamWithoutAnswers,
        getExamQuestions,
        getExamsByIds,
        getUserIdForExam,
        deleteExam,
        getExamResults,
        duplicateExam,
    };

    return examService;

    async function createExam(name: Exam['name'], duration: number | null, user: User) {
        const exam = new Exam();
        exam.name = name;
        exam.duration = duration !== null ? duration : null;
        exam.user = user;
        return examRepository.save(exam);
    }

    async function updateExamName(examId: Exam['id'], name: string) {
        const exam = await examRepository.findOneOrFail({ where: { id: examId } });
        exam.name = name;
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

    async function getExams(user: User) {
        return examRepository.find({ where: { user }, order: { createdAt: 'DESC' } });
    }

    async function getUserIdForExam(examId: Exam['id']): Promise<User['id']> {
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            select: { id: true, user: { id: true } },
            relations: ['user'],
        });
        return exam.user.id;
    }

    async function getExamExercises(examId: Exam['id']) {
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            order: {
                exercises: { order: 'ASC' },
            },
            select: {
                id: true,
                name: true,
                exercises: {
                    id: true,
                    name: true,
                    instruction: true,
                    defaultQuestionKind: true,
                    defaultPoints: true,
                    order: true,
                    questions: { id: true, points: true },
                },
            },
            relations: ['exercises', 'exercises.questions'],
        });
        return {
            ...exam,
            exercises: exam.exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                instruction: exercise.instruction,
                defaultQuestionKind: exercise.defaultQuestionKind,
                defaultPoints: exercise.defaultPoints,
                order: exercise.order,
                totalPoints: computeSumPoints(exercise.questions),
            })),
        };
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
                    manualGrades: true,
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
}
