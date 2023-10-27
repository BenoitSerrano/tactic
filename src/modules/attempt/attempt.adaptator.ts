import { Exam } from '../exam';
import { Attempt } from './Attempt.entity';
import { attemptUtils } from './attempt.utils';
import { attemptAnswersType } from './types';

const attemptAdaptator = {
    convertAttemptToAttemptWithAnswers,
    convertAttemptToAttemptWithoutAnswers,
};

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
    exam: Exam,
    attemptAnswers: attemptAnswersType,
) {
    const questions = exam.exercises.map((exercise) => exercise.questions).flat();
    const marks = attemptUtils.aggregateMarks({
        answers: attemptAnswers,
        marksArray: attempt.marks,
        questions,
    });

    return {
        id: attempt.id,
        startedAt: attempt.startedAt,
        updatedAt: attempt.updatedAt,
        exam: {
            id: exam.id,
            name: exam.name,
            duration: exam.duration,
            extraTime: exam.extraTime,
            exercises: exam.exercises.map((exercise) => ({
                ...exercise,
                questions: exercise.questions.map((question) => ({
                    ...question,
                    mark: marks[question.id],
                    answer: attemptAnswers[question.id],
                })),
            })),
        },
    };
}

export { attemptAdaptator };
