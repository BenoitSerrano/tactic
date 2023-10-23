import { dataSource } from '../../dataSource';
import { mapEntities } from '../../lib/mapEntities';
import { Exam, buildExamService } from '../exam';
import { Question, buildQuestionService } from '../question';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';

export { buildAttemptService };

function buildAttemptService() {
    const attemptRepository = dataSource.getRepository(Attempt);

    const studentService = {
        searchAttempts,
        createAttempt,
        updateAttempt,
        fetchAttemptWithAnswers,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        assertIsTimeLimitNotExceeded,
        updateAttemptDuration,
        updateAttemptTreatmentStatus,
        updateAttemptCheatingSummary,
        getAllAttempts,
        bulkInsertAttempts,
        deleteQuestionAnswers,
        updateMarks,
    };

    return studentService;

    async function searchAttempts(examId: string, studentId: string) {
        const attempt = await attemptRepository.find({
            where: { exam: { id: examId }, student: { id: studentId } },
        });
        return attempt;
    }

    async function createAttempt(examId: string, studentId: string) {
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const attempt = await attemptRepository.save({ exam, student });

        return attempt;
    }

    async function updateAttempt(attemptId: string, attemptAnswers: attemptAnswersType) {
        const questionService = buildQuestionService();
        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                startedAt: true,
                exam: {
                    id: true,
                    duration: true,
                    extraTime: true,
                    exercises: { id: true, questions: { id: true } },
                },
            },
            relations: ['exam', 'exam.exercises', 'exam.exercises.questions'],
        });
        const questionIds: Question['id'][] = [];
        for (const exercise of attempt.exam.exercises) {
            questionIds.push(...exercise.questions.map((question) => question.id));
        }
        const questions = await questionService.getQuestions(questionIds);
        await assertIsTimeLimitNotExceeded(attempt);
        await updateAttemptDuration(attempt.id);

        const answers = attemptUtils.stringifyAnswers(attemptAnswers);
        const marks = attemptUtils.computeMarks(questions, attemptAnswers);
        await attemptRepository.update({ id: attempt.id }, { answers, marks });
        return true;
    }

    async function fetchAttemptWithAnswers(attemptId: string) {
        const examService = buildExamService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: { id: true },
                startedAt: true,
                answers: true,
                marks: true,
            },

            relations: ['exam'],
        });
        const exam = await examService.getExamQuestions(attempt.exam.id);
        const attemptAnswers = attemptUtils.parseAnswers(attempt.answers);

        const result = attemptAdaptator.convertAttemptToAttemptWithAnswers(
            attempt,
            exam,
            attemptAnswers,
        );

        return result;
    }

    async function fetchAttemptWithoutAnswers(attemptId: string) {
        const examService = buildExamService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: { id: true },
                startedAt: true,
                answers: true,
            },

            relations: ['exam'],
        });
        const exam = await examService.getExamQuestions(attempt.exam.id);
        const attemptAnswers = attemptUtils.parseAnswers(attempt.answers);

        const result = attemptAdaptator.convertAttemptToAttemptWithoutAnswers(
            attempt,
            exam,
            attemptAnswers,
        );

        return result;
    }

    async function assertIsTimeLimitNotExceeded(attempt: Attempt) {
        if (attemptUtils.isTimeLimitExceeded(attempt, new Date())) {
            throw new Error(`The time limit is exceeded!`);
        }
    }

    async function updateAttemptDuration(attemptId: string) {
        const result = await attemptRepository.update(
            { id: attemptId },
            { updatedAt: () => 'CURRENT_TIMESTAMP' },
        );
        return result.affected == 1;
    }

    async function deleteAttempt(attemptId: string) {
        const result = await attemptRepository.delete({ id: attemptId });
        return result.affected == 1;
    }

    async function updateAttemptTreatmentStatus(attemptId: string, hasBeenTreated: boolean) {
        const result = await attemptRepository.update({ id: attemptId }, { hasBeenTreated });
        return result.affected == 1;
    }

    async function updateAttemptCheatingSummary(
        attemptId: string,
        body: { roundTrips: number; timeSpentOutside: number },
    ) {
        const result = await attemptRepository.update(
            { id: attemptId },
            { roundTrips: body.roundTrips, timeSpentOutside: body.timeSpentOutside },
        );
        return result.affected == 1;
    }

    async function updateMarks(attemptId: string, marks: Record<Question['id'], number>) {
        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: { id: true, marks: true },
        });

        const previousMarks = attemptUtils.decodeMarks(attempt.marks);
        const newMarks = attemptUtils.encodeMarks({ ...previousMarks, ...marks });
        await attemptRepository.update({ id: attemptId }, { marks: newMarks });
        return true;
    }

    async function getAllAttempts() {
        const attempts = await attemptRepository.find({
            relations: ['student', 'exam'],
            select: { student: { id: true }, exam: { id: true } },
        });

        return mapEntities(attempts);
    }

    async function bulkInsertAttempts(attempts: Array<Attempt>) {
        return attemptRepository.insert(attempts);
    }

    async function deleteQuestionAnswers(questionId: Question['id']) {
        const attempts = await attemptRepository.find({ select: { id: true, answers: true } });
        for (const attempt of attempts) {
            const parsedAnswers = attemptUtils.parseAnswers(attempt.answers);
            if (parsedAnswers[questionId] !== undefined) {
                delete parsedAnswers[questionId];
            }
            const newAnswers = attemptUtils.stringifyAnswers(parsedAnswers);
            await attemptRepository.update({ id: attempt.id }, { answers: newAnswers });
        }
    }
}
