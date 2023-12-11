import { encoder } from '../../../lib/encoder';
import { Question } from '../Question.entity';
import { acceptableAnswerParser } from './acceptableAnswerParser';

const questionEncoder = {
    decodeQuestion,
    encodeQuestion,
};

function decodeQuestion(question: Question): Question {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.base64ToString(answer)),
        acceptableAnswersWithPoints: question.acceptableAnswersWithPoints.map(
            (acceptableAnswer) => {
                const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                const decodedAnswer = encoder.base64ToString(answer);
                return acceptableAnswerParser.stringify(points, decodedAnswer);
            },
        ),
    };
}

function encodeQuestion(question: Question): Question {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.stringToBase64(answer)),
        acceptableAnswersWithPoints: question.acceptableAnswersWithPoints.map(
            (acceptableAnswer) => {
                const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                const decodedAnswer = encoder.stringToBase64(answer);
                return acceptableAnswerParser.stringify(points, decodedAnswer);
            },
        ),
    };
}

export { questionEncoder };
