import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function removeOkAnswerFromQuestionFromTexteATrousQuestion(
    question: Question,
    body: { okAnswer: string; blankIndex: number },
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedOkAnswer = sanitizer.sanitizeString(body.okAnswer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers[body.blankIndex];

    const acceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedOkAnswer,
    );
    if (acceptableAnswerIndex === -1) {
        throw new Error(
            `Could not answer "${body.okAnswer}" from acceptable answers: not in the list`,
        );
    }
    const acceptableAnswers = [...decodedQuestion.acceptableAnswers[body.blankIndex]];
    acceptableAnswers.splice(acceptableAnswerIndex, 1);
    decodedQuestion.acceptableAnswers[body.blankIndex] = acceptableAnswers;

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { removeOkAnswerFromQuestionFromTexteATrousQuestion };
