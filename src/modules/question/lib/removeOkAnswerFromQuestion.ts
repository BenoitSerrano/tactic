import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function removeOkAnswerFromQuestion(question: Question, okAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedOkAnswer = sanitizer.sanitizeString(okAnswer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers;

    const acceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedOkAnswer,
    );
    if (acceptableAnswerIndex !== -1) {
        const acceptableAnswers = [...decodedQuestion.acceptableAnswers];
        acceptableAnswers.splice(acceptableAnswerIndex, 1);
        decodedQuestion.acceptableAnswers = acceptableAnswers;
    }

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { removeOkAnswerFromQuestion };
