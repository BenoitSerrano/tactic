import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(question: Question, acceptableAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswer);

    const rightAnswerIndex = decodedQuestion.rightAnswers.findIndex(
        (rightAnswer) => sanitizer.sanitizeString(rightAnswer) === sanitizedAcceptableAnswer,
    );
    if (rightAnswerIndex !== -1) {
        if (decodedQuestion.rightAnswers.length <= 1) {
            return question;
        }
        const rightAnswers = [...decodedQuestion.rightAnswers];
        rightAnswers.splice(rightAnswerIndex, 1);
        decodedQuestion.rightAnswers = rightAnswers;
    }

    decodedQuestion.acceptableAnswers = [
        ...decodedQuestion.acceptableAnswers,
        sanitizedAcceptableAnswer,
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
