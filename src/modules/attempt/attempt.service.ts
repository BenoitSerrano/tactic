import { Equal, In, IsNull, Not } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Exam, buildExamService } from '../exam';
import { Exercise, buildExerciseService } from '../exercise';
import { computeAttemptStatus } from '../lib/computeExamStatus';
import { Question, buildQuestionService } from '../question';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';
import { buildUserService, User } from '../user';

export { buildAttemptService };

function buildAttemptService() {
    const attemptRepository = dataSource.getRepository(Attempt);

    const attemptService = {
        convertAttemptQuestionPoints,
        searchAttempt,
        createAttempt,
        updateAttempt,
        getAttemptWithAnswers,
        getAttemptWithoutAnswers,
        deleteAttempt,
        assertIsTimeLimitNotExceeded,
        updateAttemptDuration,
        updateAttemptCheatingSummary,
        getAllAttempts,
        deleteQuestionAnswers,
        deleteExerciseAnswers,
        updateManualMark,
        updateAttemptEndedAt,
        deleteAttemptEndedAt,
        updateAttemptCorrectedAt,
        deleteAttemptCorrectedAt,
        getAttemptsCountByCorrectionStatus,
        convertAttemptQuestionsPoints,
        updateNonTreatedAttempts,
    };

    return attemptService;

    async function searchAttempt(examId: string, studentId: string) {
        const attempts = await attemptRepository.find({
            select: { id: true, correctedAt: true },
            where: { exam: { id: examId }, student: { id: studentId } },
        });
        if (attempts.length === 1) {
            return { attempt: attempts[0] };
        }
        return { attempt: undefined };
    }

    async function createAttempt(examId: string, studentId: string) {
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneOrFail({
            where: { id: examId },
            relations: { user: true },
        });

        const attempt = await attemptRepository.save({ exam, student, user: exam.user });
        const hasRemainingPapers = exam.user.remainingPapers > 0;

        if (hasRemainingPapers) {
            const userService = buildUserService();
            await userService.decreaseRemainingPapers(exam.user);
            await attemptRepository.update(
                { id: attempt.id },
                { treatedAt: () => 'CURRENT_TIMESTAMP' },
            );
        }

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

    async function getAttemptWithAnswers(attemptId: Attempt['id']) {
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
                manualMarks: true,
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

    async function convertAttemptQuestionsPoints({
        nextPoints,
        questions,
        examId,
    }: {
        questions: Question[];
        nextPoints: number;
        examId: Exam['id'];
    }) {
        const attempts = await attemptRepository.find({
            where: { exam: { id: examId }, manualMarks: Not(Equal('')) },
        });
        const updatedAttempts: Attempt[] = [];
        for (const attempt of attempts) {
            let updatedAttempt = attempt;
            const previousMarks = attemptUtils.decodeManualMarks(attempt.manualMarks);
            let nextMarks = previousMarks;
            for (const question of questions) {
                const previousMark = previousMarks[question.id];
                if (previousMark !== undefined) {
                    const convertedMark = attemptUtils.convertMark({
                        previousPoints: question.points,
                        nextPoints,
                        previousMark,
                    });
                    nextMarks = { ...nextMarks, [question.id]: convertedMark };
                }
            }
            updatedAttempt = {
                ...attempt,
                manualMarks: attemptUtils.encodeManualMarks(nextMarks),
            };
            updatedAttempts.push(updatedAttempt);
        }
        return attemptRepository.save(updatedAttempts);
    }

    async function convertAttemptQuestionPoints({
        nextPoints,
        previousPoints,
        questionId,
        examId,
    }: {
        previousPoints: number;
        nextPoints: number;
        questionId: Question['id'];
        examId: Exam['id'];
    }) {
        const attempts = await attemptRepository.find({ where: { exam: { id: examId } } });
        const updatedAttempts: Attempt[] = [];
        for (const attempt of attempts) {
            const previousMarks = attemptUtils.decodeManualMarks(attempt.manualMarks);
            const previousMark = previousMarks[questionId];
            if (previousMark === undefined) {
                updatedAttempts.push(attempt);
            } else {
                const convertedMark = attemptUtils.convertMark({
                    previousPoints,
                    nextPoints,
                    previousMark,
                });
                const nextMarks = attemptUtils.encodeManualMarks({
                    ...previousMarks,
                    [questionId]: convertedMark,
                });
                const updatedAttempt = { ...attempt, manualMarks: nextMarks };
                updatedAttempts.push(updatedAttempt);
            }
        }
        return attemptRepository.save(updatedAttempts);
    }

    async function getAttemptWithoutAnswers(attemptId: Attempt['id']) {
        const examService = buildExamService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: { id: true },
                startedAt: true,
                updatedAt: true,
                correctedAt: true,
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

    async function updateManualMark(
        attemptId: Attempt['id'],
        questionId: Question['id'],
        manualMark: number,
    ) {
        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: { id: true, manualMarks: true },
        });

        const previousMarks = attemptUtils.decodeManualMarks(attempt.manualMarks);
        const newMarks = attemptUtils.encodeManualMarks({
            ...previousMarks,
            [questionId]: manualMark,
        });
        await attemptRepository.update({ id: attemptId }, { manualMarks: newMarks });
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
            select: { student: { id: true }, exam: { id: true }, user: { id: true } },
        });

        return attempts;
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

    async function getAttemptsCountByCorrectionStatus(examId: Exam['id']) {
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

    async function updateNonTreatedAttempts(userId: User['id'], maxAttemptsToTreat: number) {
        const nonTreatedAttempts = await attemptRepository.find({
            where: { treatedAt: IsNull(), user: { id: userId } },
            order: { startedAt: 'ASC' },
        });
        let attemptIdsToTreat: Attempt['id'][] = [
            ...nonTreatedAttempts.map((attempt) => attempt.id),
        ];
        if (nonTreatedAttempts.length > maxAttemptsToTreat) {
            attemptIdsToTreat = attemptIdsToTreat.slice(0, maxAttemptsToTreat);
        }
        await attemptRepository.update(
            { id: In(attemptIdsToTreat) },
            { treatedAt: () => 'CURRENT_TIMESTAMP' },
        );
        return attemptIdsToTreat.length;
    }
}
