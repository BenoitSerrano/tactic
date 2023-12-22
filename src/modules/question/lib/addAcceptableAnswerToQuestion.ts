import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerWithPointsType } from '../types';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(
    question: Question,
    acceptableAnswer: acceptableAnswerWithPointsType,
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswer.answer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers;

    const alreadyPresentAcceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => answer === sanitizedAcceptableAnswer,
    );
    if (alreadyPresentAcceptableAnswerIndex !== -1) {
        if (
            currentParsedAcceptableAnswers[alreadyPresentAcceptableAnswerIndex].points ===
            acceptableAnswer.points
        ) {
            return question;
        } else {
            decodedQuestion.acceptableAnswers[alreadyPresentAcceptableAnswerIndex] = {
                points: acceptableAnswer.points,
                answer: sanitizedAcceptableAnswer,
            };
            return questionEncoder.encodeQuestion(decodedQuestion);
        }
    }

    decodedQuestion.acceptableAnswers = [
        ...decodedQuestion.acceptableAnswers,
        { points: acceptableAnswer.points, answer: sanitizedAcceptableAnswer },
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
