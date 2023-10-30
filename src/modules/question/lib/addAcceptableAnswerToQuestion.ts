import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(question: Question, acceptableAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswer);
    decodedQuestion.acceptableAnswers = [
        ...decodedQuestion.acceptableAnswers,
        sanitizedAcceptableAnswer,
    ];
    const rightAnswerIndex = decodedQuestion.rightAnswers.findIndex(
        (rightAnswer) => sanitizer.sanitizeString(rightAnswer) === sanitizedAcceptableAnswer,
    );
    if (rightAnswerIndex !== -1) {
        const rightAnswers = [...decodedQuestion.rightAnswers];
        rightAnswers.splice(rightAnswerIndex, 1);
        decodedQuestion.rightAnswers = rightAnswers;
    }
    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
