import { examDtoType } from '../exam/types';
import { computeAttemptStatus } from '../lib/computeExamStatus';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';

const attemptAdaptator = {
    convertAttemptToAttemptWithoutAnswers,
    convertAttemptToAttemptWithAnswers,
};

function convertAttemptToAttemptWithoutAnswers(
    attempt: Attempt,
    exam: examDtoType,
    attemptAnswers: attemptAnswersType,
    studentEmail: Student['email'],
) {
    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        endedAt: attempt.endedAt,
        updatedAt: attempt.updatedAt,
        correctedAt: attempt.correctedAt,
        studentEmail,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map((question) => ({
                    id: question.id,
                    kind: question.kind,
                    title: question.title,
                    possibleAnswers: question.possibleAnswers,
                    points: question.points,
                    currentAnswer: attemptAnswers[question.id],
                })),
            })),
        },
    };
}

function convertAttemptToAttemptWithAnswers(
    attempt: Attempt,
    exam: examDtoType,
    attemptAnswers: attemptAnswersType,
    studentEmail: Student['email'],
) {
    const now = new Date();

    const attemptStatus = computeAttemptStatus(
        attempt,
        {
            duration: exam.duration,
            extraTime: exam.extraTime,
        },
        now,
    );

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        correctedAt: attempt.correctedAt,
        isTreated: !!attempt.treatedAt,
        attemptStatus,
        studentEmail,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            shouldDisplayRightAnswers: exam.shouldDisplayRightAnswers,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map((question) => ({
                    ...question,
                    ...attemptUtils.computeNotationInfo({
                        answers: attemptAnswers,
                        manualMarks: attempt.manualMarks,
                        question,
                    }),
                    answer: attemptAnswers[question.id],
                })),
            })),
        },
    };
}

export { attemptAdaptator };
