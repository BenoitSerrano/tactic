import { Exam } from '../exam';
import { Attempt } from './Attempt.entity';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';

const attemptAdaptator = {
    convertAttemptToAttemptWithAnswers,
    computeTreatmentStatusSummary,
    convertAttemptToAttemptWithoutAnswers,
};

function computeTreatmentStatusSummary(attempts: Attempt[]) {
    const treatmentStatusSummary: Record<string, boolean> = {};
    attempts.forEach((attempt) => {
        treatmentStatusSummary[attempt.id] = attempt.hasBeenTreated;
    });

    return treatmentStatusSummary;
}

function convertAttemptToAttemptWithoutAnswers(
    attempt: Attempt,
    exam: Exam,
    attemptAnswers: attemptAnswersType,
) {
    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,

            questions: exam.questions.map((question) => ({
                id: question.id,
                kind: question.kind,
                title: question.title,
                possibleAnswers: question.possibleAnswers,
                currentAnswer: attemptAnswers[question.id],
            })),
        },
    };
}

function convertAttemptToAttemptWithAnswers(
    attempt: Attempt,
    exam: Exam,
    attemptAnswers: attemptAnswersType,
) {
    const marks = attemptUtils.decodeMarks(attempt.marks);

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            questions: exam.questions.map((question) => ({
                ...question,
                mark: marks[question.id],
                answer: attemptAnswers[question.id],
            })),
        },
    };
}

export { attemptAdaptator };
