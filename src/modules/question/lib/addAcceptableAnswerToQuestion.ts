import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerParser } from './acceptableAnswerParser';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(
    question: Question,
    acceptableAnswer: string,
    points: number,
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswersWithPoints.map(
        (acceptableAnswer) => acceptableAnswerParser.parse(acceptableAnswer),
    );

    const alreadyPresentAcceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => answer === sanitizedAcceptableAnswer,
    );
    if (alreadyPresentAcceptableAnswerIndex !== -1) {
        if (currentParsedAcceptableAnswers[alreadyPresentAcceptableAnswerIndex].points === points) {
            return question;
        } else {
            decodedQuestion.acceptableAnswersWithPoints[alreadyPresentAcceptableAnswerIndex] =
                acceptableAnswerParser.stringify(points, sanitizedAcceptableAnswer);
            return questionEncoder.encodeQuestion(decodedQuestion);
        }
    }

    decodedQuestion.acceptableAnswersWithPoints = [
        ...decodedQuestion.acceptableAnswersWithPoints,
        acceptableAnswerParser.stringify(points, sanitizedAcceptableAnswer),
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
