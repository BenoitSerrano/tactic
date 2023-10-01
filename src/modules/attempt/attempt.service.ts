import { dataSource } from '../../dataSource';
import { Exam } from '../exam';
import { phraseMelangeeAnswersType } from '../phraseMelangee';
import { buildPhraseMelangeeAnswerService } from '../phraseMelangeeAnswer';
import { buildQcmAnswerService, qcmChoicesType } from '../qcmAnswer';
import { buildQuestionTrouAnswerService } from '../questionTrouAnswer';
import { questionTrouAnswersType } from '../questionTrouAnswer/types';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';

export { buildAttemptService };

export type { attemptAnswersType };

type attemptAnswersType = {
    qcmChoices: qcmChoicesType;
    questionTrouAnswers: questionTrouAnswersType;
    phraseMelangeeAnswers: phraseMelangeeAnswersType;
};

function buildAttemptService() {
    const studentService = {
        searchAttempts,
        createAttempt,
        createEmptyAttempt,
        updateAttempt,
        fetchAttempt,
        fetchAttemptWithoutAnswers,
        deleteAttempt,
        assertIsTimeLimitNotExceeded,
        updateAttemptDuration,
        updateAttemptTreatmentStatus,
        updateAttemptCheatingSummary,
    };

    return studentService;

    async function searchAttempts(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.find({
            where: { exam: { id: examId }, student: { id: studentId } },
        });
        return attempt;
    }

    async function createAttempt(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const attempt = await attemptRepository.save({ exam, student });

        return attempt;
    }

    async function createEmptyAttempt(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const attempt = await attemptRepository.save({
            exam,
            student,
            updatedAt: 'NOW()',
        });

        return attempt;
    }

    async function updateAttempt(attemptId: string, attemptAnswers: attemptAnswersType) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const qcmAnswerService = buildQcmAnswerService();
        const questionTrouAnswerService = buildQuestionTrouAnswerService();
        const phraseMelangeeAnswerService = buildPhraseMelangeeAnswerService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            relations: ['exam'],
        });
        await assertIsTimeLimitNotExceeded(attempt);
        await updateAttemptDuration(attempt.id);
        // TODO : vérifier que les questions pour lesquelles on envoie des réponses sont bien dans cet exam

        await qcmAnswerService.updateQcmChoices(attempt, attemptAnswers.qcmChoices);
        await questionTrouAnswerService.updateQuestionTrouAnswers(
            attempt,
            attemptAnswers.questionTrouAnswers,
        );
        await phraseMelangeeAnswerService.updatePhraseMelangeeAnswers(
            attempt,
            attemptAnswers.phraseMelangeeAnswers,
        );
        return true;
    }

    async function fetchAttempt(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            order: {
                exam: {
                    questionsChoixMultiple: { order: 'ASC' },
                    questionsTrou: { order: 'ASC' },
                    phrasesMelangees: { order: 'ASC' },
                },
            },
            relations: [
                'exam',
                'qcmAnswers',
                'qcmAnswers.questionChoixMultiple',
                'questionTrouAnswers',
                'questionTrouAnswers.questionTrou',
                'phraseMelangeAnswers',
                'phraseMelangeAnswers.phraseMelangee',
                'exam.questionsChoixMultiple',
                'exam.questionsTrou',
                'exam.phrasesMelangees',
            ],
        });

        return attemptAdaptator.convertAttemptToAttemptWithAnswers(attempt);
    }

    async function fetchAttemptWithoutAnswers(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            select: {
                id: true,
                exam: {
                    id: true,
                    duration: true,
                    extraTime: true,
                    name: true,
                    questionsChoixMultiple: {
                        id: true,
                        order: true,
                        possibleAnswers: true,
                        title: true,
                    },
                    questionsTrou: { id: true, beforeText: true, afterText: true, order: true },
                    phrasesMelangees: { id: true, order: true, words: true, shuffledPhrase: true },
                },
                phraseMelangeAnswers: { answer: true, id: true, phraseMelangee: { id: true } },
                qcmAnswers: { choice: true, id: true, questionChoixMultiple: { id: true } },
                questionTrouAnswers: { answer: true, id: true },
                startedAt: true,
            },
            order: {
                exam: {
                    questionsChoixMultiple: { order: 'ASC' },
                    questionsTrou: { order: 'ASC' },
                    phrasesMelangees: { order: 'ASC' },
                },
            },
            relations: [
                'exam',
                'qcmAnswers',
                'qcmAnswers.questionChoixMultiple',
                'questionTrouAnswers',
                'questionTrouAnswers.questionTrou',
                'phraseMelangeAnswers',
                'phraseMelangeAnswers.phraseMelangee',
                'exam.questionsChoixMultiple',
                'exam.questionsTrou',
                'exam.phrasesMelangees',
            ],
        });

        return attemptAdaptator.convertAttemptToAttemptWithoutAnswers(attempt);
    }

    async function assertIsTimeLimitNotExceeded(attempt: Attempt) {
        if (attemptUtils.isTimeLimitExceeded(attempt, new Date())) {
            throw new Error(`The time limit is exceeded!`);
        }
    }

    async function updateAttemptDuration(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const result = await attemptRepository.update(
            { id: attemptId },
            { updatedAt: () => 'CURRENT_TIMESTAMP' },
        );
        return result.affected == 1;
    }

    async function deleteAttempt(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const result = await attemptRepository.delete({ id: attemptId });
        return result.affected == 1;
    }

    async function updateAttemptTreatmentStatus(attemptId: string, hasBeenTreated: boolean) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const result = await attemptRepository.update({ id: attemptId }, { hasBeenTreated });
        return result.affected == 1;
    }

    async function updateAttemptCheatingSummary(
        attemptId: string,
        body: { roundTrips: number; timeSpentOutside: number },
    ) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const result = await attemptRepository.update(
            { id: attemptId },
            { roundTrips: body.roundTrips, timeSpentOutside: body.timeSpentOutside },
        );
        return result.affected == 1;
    }
}
