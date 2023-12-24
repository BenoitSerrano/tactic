import { encoder } from '../../../lib/encoder';
import { Question } from '../Question.entity';
import { questionDtoType } from '../types';
import { acceptableAnswerParser } from './acceptableAnswerParser';

const questionEncoder = {
    decodeQuestion,
    encodeQuestion,
};

function decodeQuestion(question: Omit<Question, 'exercise'>): questionDtoType {
    if (question.kind === 'texteATrous') {
        return {
            ...question,
            acceptableAnswers: question.acceptableAnswers.map((acceptableAnswersPerBlank) => {
                return acceptableAnswersPerBlank.split('|').map((acceptableAnswer) => {
                    const { grade, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                    const decodedAnswer = encoder.base64ToString(answer);
                    return { grade, answer: decodedAnswer };
                });
            }),
        };
    } else {
        return {
            ...question,
            possibleAnswers: question.possibleAnswers.map((answer) =>
                encoder.base64ToString(answer),
            ),
            acceptableAnswers: [
                question.acceptableAnswers.map((acceptableAnswer) => {
                    const { grade, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                    const decodedAnswer = encoder.base64ToString(answer);
                    return { grade, answer: decodedAnswer };
                }),
            ],
        };
    }
}

function encodeQuestion(question: questionDtoType): Omit<Question, 'exercise'> {
    if (question.kind === 'texteATrous') {
        return {
            ...question,
            acceptableAnswers: question.acceptableAnswers.map((acceptableAnswersPerBlank) => {
                return acceptableAnswersPerBlank
                    .map((acceptableAnswer) => {
                        const encodedAnswer = encoder.stringToBase64(acceptableAnswer.answer);
                        return acceptableAnswerParser.stringify({
                            grade: acceptableAnswer.grade,
                            answer: encodedAnswer,
                        });
                    })
                    .join('|');
            }),
        };
    } else if (question.kind === 'texteLibre') {
        return {
            ...question,
            possibleAnswers: [],
            acceptableAnswers: [],
        };
    } else {
        return {
            ...question,
            possibleAnswers: question.possibleAnswers.map((answer) =>
                encoder.stringToBase64(answer),
            ),
            acceptableAnswers: question.acceptableAnswers[0].map((acceptableAnswer) => {
                const encodedAnswer = encoder.stringToBase64(acceptableAnswer.answer);
                return acceptableAnswerParser.stringify({
                    grade: acceptableAnswer.grade,
                    answer: encodedAnswer,
                });
            }),
        };
    }
}

export { questionEncoder };
