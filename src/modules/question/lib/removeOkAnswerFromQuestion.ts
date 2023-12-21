import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { questionEncoder } from './questionEncoder';

function removeOkAnswerFromQuestion(question: Question, okAnswer: string) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedOkAnswer = sanitizer.sanitizeString(okAnswer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswersWithPoints[0];

    const acceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedOkAnswer,
    );
    if (acceptableAnswerIndex !== -1) {
        const acceptableAnswersWithPoints = [...decodedQuestion.acceptableAnswersWithPoints[0]];
        acceptableAnswersWithPoints.splice(acceptableAnswerIndex, 1);
        decodedQuestion.acceptableAnswersWithPoints = [acceptableAnswersWithPoints];
    }

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { removeOkAnswerFromQuestion };
