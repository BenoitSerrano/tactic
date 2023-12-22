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
        acceptableAnswers: question.acceptableAnswers.map((acceptableAnswer) => {
            const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);
            const decodedAnswer = encoder.base64ToString(answer);
            return { points, answer: decodedAnswer };
        }),
    };
}

function encodeQuestion(question: questionDtoType): Omit<Question, 'exercise'> {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.stringToBase64(answer)),
        acceptableAnswers: question.acceptableAnswers.map((acceptableAnswer) => {
            const encodedAnswer = encoder.stringToBase64(acceptableAnswer.answer);
            return acceptableAnswerParser.stringify({
                points: acceptableAnswer.points,
                answer: encodedAnswer,
            });
        }),
    };
}

export { questionEncoder };
