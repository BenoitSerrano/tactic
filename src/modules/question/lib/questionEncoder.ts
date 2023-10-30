import { encoder } from '../../../lib/encoder';
import { Question } from '../Question.entity';

const questionEncoder = {
    decodeQuestion,
    encodeQuestion,
};

function decodeQuestion(question: Question): Question {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.base64ToString(answer)),
        rightAnswers: question.rightAnswers.map((answer) => encoder.base64ToString(answer)),
        acceptableAnswers: question.acceptableAnswers.map((answer) =>
            encoder.base64ToString(answer),
        ),
    };
}

function encodeQuestion(question: Question): Question {
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.stringToBase64(answer)),
        rightAnswers: question.rightAnswers.map((answer) => encoder.stringToBase64(answer)),
        acceptableAnswers: question.acceptableAnswers.map((answer) =>
            encoder.stringToBase64(answer),
        ),
    };
}

export { questionEncoder };
