import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function removeOkAnswerFromQuestion(question: Question, okAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    console.log('OkAnswer', okAnswer);
    const sanitizedOkAnswer = sanitizer.sanitizeString(okAnswer);

    const acceptableAnswerIndex = decodedQuestion.acceptableAnswers.findIndex(
        (acceptableAnswer) => sanitizer.sanitizeString(acceptableAnswer) === sanitizedOkAnswer,
    );
    if (acceptableAnswerIndex !== -1) {
        const acceptableAnswers = [...decodedQuestion.acceptableAnswers];
        acceptableAnswers.splice(acceptableAnswerIndex, 1);
        decodedQuestion.acceptableAnswers = acceptableAnswers;
    }

    const rightAnswerIndex = decodedQuestion.rightAnswers.findIndex(
        (rightAnswer) => sanitizer.sanitizeString(rightAnswer) === sanitizedOkAnswer,
    );
    if (rightAnswerIndex !== -1) {
        const rightAnswers = [...decodedQuestion.rightAnswers];
        rightAnswers.splice(rightAnswerIndex, 1);
        decodedQuestion.rightAnswers = rightAnswers;
    }

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { removeOkAnswerFromQuestion };
