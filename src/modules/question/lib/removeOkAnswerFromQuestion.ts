import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function removeOkAnswerFromQuestion(question: Question, okAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedOkAnswer = sanitizer.sanitizeString(okAnswer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers[0];

    const acceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedOkAnswer,
    );
    if (acceptableAnswerIndex === -1) {
        throw new Error(`Could not answer "${okAnswer}" from acceptable answers: not in the list`);
    }
    const acceptableAnswers = [...decodedQuestion.acceptableAnswers[0]];
    acceptableAnswers.splice(acceptableAnswerIndex, 1);
    decodedQuestion.acceptableAnswers = [acceptableAnswers];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { removeOkAnswerFromQuestion };
