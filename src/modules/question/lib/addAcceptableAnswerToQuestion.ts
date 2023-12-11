import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerWithPointsType } from '../types';
import { acceptableAnswerParser } from './acceptableAnswerParser';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(
    question: Question,
    acceptableAnswerWithPoints: acceptableAnswerWithPointsType,
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswerWithPoints.answer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswersWithPoints;

    const alreadyPresentAcceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => answer === sanitizedAcceptableAnswer,
    );
    if (alreadyPresentAcceptableAnswerIndex !== -1) {
        if (
            currentParsedAcceptableAnswers[alreadyPresentAcceptableAnswerIndex].points ===
            acceptableAnswerWithPoints.points
        ) {
            return question;
        } else {
            decodedQuestion.acceptableAnswersWithPoints[alreadyPresentAcceptableAnswerIndex] = {
                points: acceptableAnswerWithPoints.points,
                answer: sanitizedAcceptableAnswer,
            };
            return questionEncoder.encodeQuestion(decodedQuestion);
        }
    }

    decodedQuestion.acceptableAnswersWithPoints = [
        ...decodedQuestion.acceptableAnswersWithPoints,
        { points: acceptableAnswerWithPoints.points, answer: sanitizedAcceptableAnswer },
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
