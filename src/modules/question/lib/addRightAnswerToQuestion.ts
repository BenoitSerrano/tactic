import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function addRightAnswerToQuestion(question: Question, rightAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedRightAnswer = sanitizer.sanitizeString(rightAnswer);
    decodedQuestion.rightAnswers = [...decodedQuestion.rightAnswers, sanitizedRightAnswer];
    const acceptableAnswerIndex = decodedQuestion.acceptableAnswers.findIndex(
        (acceptableAnswer) => sanitizer.sanitizeString(acceptableAnswer) === sanitizedRightAnswer,
    );
    if (acceptableAnswerIndex !== -1) {
        const acceptableAnswers = [...decodedQuestion.acceptableAnswers];
        acceptableAnswers.splice(acceptableAnswerIndex, 1);
        decodedQuestion.acceptableAnswers = acceptableAnswers;
    }
    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addRightAnswerToQuestion };
