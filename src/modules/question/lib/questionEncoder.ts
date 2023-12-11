import { encoder } from '../../../lib/encoder';
import { Question } from '../Question.entity';
import { questionDtoType } from '../types';
import { acceptableAnswerParser } from './acceptableAnswerParser';

const questionEncoder = {
    decodeQuestion,
    encodeQuestion,
};

function decodeQuestion(question: Omit<Question, 'exercise'>): questionDtoType {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.base64ToString(answer)),
        acceptableAnswersWithPoints: question.acceptableAnswersWithPoints.map(
            (acceptableAnswer) => {
                const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                const decodedAnswer = encoder.base64ToString(answer);
                return { points, answer: decodedAnswer };
            },
        ),
    };
}

function encodeQuestion(question: questionDtoType): Omit<Question, 'exercise'> {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.stringToBase64(answer)),
        acceptableAnswersWithPoints: question.acceptableAnswersWithPoints.map(
            (acceptableAnswerWithPoints) => {
                const encodedAnswer = encoder.stringToBase64(acceptableAnswerWithPoints.answer);
                return acceptableAnswerParser.stringify({
                    points: acceptableAnswerWithPoints.points,
                    answer: encodedAnswer,
                });
            },
        ),
    };
}

export { questionEncoder };
