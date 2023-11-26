import { dataSource } from '../../dataSource';
import { mapEntities } from '../../lib/mapEntities';
import { Exam, buildExamService } from '../exam';
import { Exercise, buildExerciseService } from '../exercise';
import { computeAttemptStatus } from '../lib/computeExamStatus';
import { Question, buildQuestionService } from '../question';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';

export { buildAttemptService };

function buildAttemptService() {
    const attemptRepository = dataSource.getRepository(Attempt);

    const attemptService = {
        searchAttempts,
        createAttempt,
        updateAttempt,
        fetchAttemptWithAnswers,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        assertIsTimeLimitNotExceeded,
        updateAttemptDuration,
        updateAttemptCheatingSummary,
        getAllAttempts,
        bulkInsertAttempts,
        deleteQuestionAnswers,
        deleteExerciseAnswers,
        updateMark,
        updateAttemptEndedAt,
        deleteAttemptEndedAt,
        updateAttemptCorrectedAt,
        deleteAttemptCorrectedAt,
        fetchAttemptsCountByCorrectionStatus,
    };

    return attemptService;

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

    async function updateAttempt(attemptId: Attempt['id'], attemptAnswers: attemptAnswersType) {
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
        await assertIsTimeLimitNotExceeded(attempt);
        await updateAttemptDuration(attempt.id);

        const answers = attemptUtils.stringifyAnswers(attemptAnswers);
        await attemptRepository.update({ id: attempt.id }, { answers });
        return true;
    }

    async function fetchAttemptWithAnswers(attemptId: Attempt['id']) {
        const examService = buildExamService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: { id: true },
                startedAt: true,
                correctedAt: true,
                endedAt: true,
                answers: true,
                marks: true,
                student: { id: true, email: true },
            },

            relations: ['exam', 'student'],
        });
        const exam = await examService.getExamQuestions(attempt.exam.id);
        const attemptAnswers = attemptUtils.parseAnswers(attempt.answers);
        const studentEmail = attempt.student.email;

        const result = attemptAdaptator.convertAttemptToAttemptWithAnswers(
            attempt,
            exam,
            attemptAnswers,
            studentEmail,
        );

        return result;
    }

    async function fetchAttemptWithoutAnswers(attemptId: Attempt['id']) {
        const examService = buildExamService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: { id: true },
                startedAt: true,
                endedAt: true,
                answers: true,
                student: { id: true, email: true },
            },

            relations: ['exam', 'student'],
        });
        const exam = await examService.getExamQuestions(attempt.exam.id);
        const attemptAnswers = attemptUtils.parseAnswers(attempt.answers);
        const studentEmail = attempt.student.email;

        const result = attemptAdaptator.convertAttemptToAttemptWithoutAnswers(
            attempt,
            exam,
            attemptAnswers,
            studentEmail,
        );

        return result;
    }

    async function assertIsTimeLimitNotExceeded(attempt: Attempt) {
        const { startedAt, exam } = attempt;
        const now = new Date();
        if (
            attemptUtils.computeIsTimeLimitExceeded({
                now,
                startedAt,
                duration: exam.duration,
                extraTime: exam.extraTime,
            })
        ) {
            throw new Error(`The time limit is exceeded!`);
        }
    }

    async function updateAttemptDuration(attemptId: Attempt['id']) {
        const result = await attemptRepository.update(
            { id: attemptId },
            { updatedAt: () => 'CURRENT_TIMESTAMP' },
        );
        return result.affected == 1;
    }

    async function deleteAttempt(attemptId: Attempt['id']) {
        const result = await attemptRepository.delete({ id: attemptId });
        return result.affected == 1;
    }

    async function updateAttemptCheatingSummary(
        attemptId: Attempt['id'],
        body: { roundTrips: number; timeSpentOutside: number },
    ) {
        const result = await attemptRepository.update(
            { id: attemptId },
            { roundTrips: body.roundTrips, timeSpentOutside: body.timeSpentOutside },
        );
        return result.affected == 1;
    }

    async function updateMark(attemptId: Attempt['id'], questionId: Question['id'], mark: number) {
        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: { id: true, marks: true },
        });

        const previousMarks = attemptUtils.decodeMarks(attempt.marks);
        const newMarks = attemptUtils.encodeMarks({ ...previousMarks, [questionId]: mark });
        await attemptRepository.update({ id: attemptId }, { marks: newMarks });
        return true;
    }

    async function updateAttemptEndedAt(attemptId: Attempt['id']) {
        await attemptRepository.update({ id: attemptId }, { endedAt: () => 'CURRENT_TIMESTAMP' });
        return true;
    }

    async function deleteAttemptEndedAt(attemptId: Attempt['id']) {
        await attemptRepository.update({ id: attemptId }, { endedAt: null });
        return true;
    }

    async function updateAttemptCorrectedAt(attemptId: Attempt['id']) {
        await attemptRepository.update(
            { id: attemptId },
            { correctedAt: () => 'CURRENT_TIMESTAMP' },
        );
        return true;
    }

    async function deleteAttemptCorrectedAt(attemptId: Attempt['id']) {
        await attemptRepository.update({ id: attemptId }, { correctedAt: null });
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
        //TODO ne pas récup tous les attempts, mais juste ceux lié à l'exam qui contient cette question
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

    async function deleteExerciseAnswers(exerciseId: Exercise['id']) {
        const questionService = buildQuestionService();
        const questionIds = await questionService.getQuestionIds(exerciseId);

        const exerciseService = buildExerciseService();
        const examId = await exerciseService.getExamId(exerciseId);
        const attempts = await attemptRepository.find({
            where: { exam: { id: examId } },
            select: { id: true, answers: true },
        });
        for (const attempt of attempts) {
            const parsedAnswers = attemptUtils.parseAnswers(attempt.answers);
            for (const questionId of questionIds) {
                if (parsedAnswers[questionId] !== undefined) {
                    delete parsedAnswers[questionId];
                }
            }
            const newAnswers = attemptUtils.stringifyAnswers(parsedAnswers);
            await attemptRepository.update({ id: attempt.id }, { answers: newAnswers });
        }
    }

    async function fetchAttemptsCountByCorrectionStatus(examId: Exam['id']) {
        const attempts = await attemptRepository.find({
            select: {
                id: true,
                endedAt: true,
                startedAt: true,
                correctedAt: true,
                exam: { id: true, duration: true, extraTime: true },
            },
            where: { exam: { id: examId } },
            relations: ['exam'],
        });
        const now = new Date();
        let corrected = 0,
            notCorrected = 0;

        for (const attempt of attempts) {
            const attemptStatus = computeAttemptStatus(
                attempt,
                {
                    duration: attempt.exam.duration,
                    extraTime: attempt.exam.extraTime,
                },
                now,
            );
            if (attemptStatus === 'corrected') {
                corrected++;
            } else {
                notCorrected++;
            }
        }
        return { corrected, notCorrected };
    }
}
