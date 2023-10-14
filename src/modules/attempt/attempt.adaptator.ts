import { Exam } from '../exam';
import { Question } from '../question';
import { Attempt } from './Attempt.entity';
import { computeQuestionAnswerStatus } from './computeQuestionAnswerStatus';
import { attemptAnswersType, questionAnswerSummaryType } from './types';

const attemptAdaptator = {
    convertAttemptToAttemptWithAnswers,
    computeTreatmentStatusSummary,
    convertAttemptToAttemptWithoutAnswers,
    computeQuestionAnswersSummary,
};

function computeTreatmentStatusSummary(attempts: Attempt[]) {
    const treatmentStatusSummary: Record<string, boolean> = {};
    attempts.forEach((attempt) => {
        treatmentStatusSummary[attempt.id] = attempt.hasBeenTreated;
    });

    return treatmentStatusSummary;
}

function computeQuestionAnswersSummary(attemptAnswers: attemptAnswersType, questions: Question[]) {
    const questionAnswerSummary: questionAnswerSummaryType = {};

    questions.forEach((question) => {
        const answer = attemptAnswers[question.id];
        const status = computeQuestionAnswerStatus(
            answer,
            question.rightAnswers,
            question.acceptableAnswers,
        );
        questionAnswerSummary[question.id] = {
            answer,
            status,
            points: question.points,
        };
    });
    return questionAnswerSummary;
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
    const questionAnswersSummary = attemptAdaptator.computeQuestionAnswersSummary(
        attemptAnswers,
        exam.questions,
    );

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
                answer: questionAnswersSummary[question.id]?.answer,
                status: questionAnswersSummary[question.id]?.status,
            })),
        },
    };
}

export { attemptAdaptator };
