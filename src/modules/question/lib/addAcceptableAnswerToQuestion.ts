import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerWithPointsType } from '../types';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(
    question: Question,
    acceptableAnswerWithPoints: acceptableAnswerWithPointsType,
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswerWithPoints.answer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswersWithPoints[0];

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
            decodedQuestion.acceptableAnswersWithPoints[0][alreadyPresentAcceptableAnswerIndex] = {
                points: acceptableAnswerWithPoints.points,
                answer: sanitizedAcceptableAnswer,
            };
            return questionEncoder.encodeQuestion(decodedQuestion);
        }
    }

    decodedQuestion.acceptableAnswersWithPoints = [
        [
            ...decodedQuestion.acceptableAnswersWithPoints[0],
            { points: acceptableAnswerWithPoints.points, answer: sanitizedAcceptableAnswer },
        ],
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
