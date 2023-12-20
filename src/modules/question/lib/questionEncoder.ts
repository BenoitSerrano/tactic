import { encoder } from '../../../lib/encoder';
import { Question } from '../Question.entity';
import { questionDtoType } from '../types';
import { acceptableAnswerParser } from './acceptableAnswerParser';

const questionEncoder = {
    decodeQuestion,
    encodeQuestion,
};

function decodeQuestion(question: Omit<Question, 'exercise'>): questionDtoType {
    const acceptableAnswersWithPoints =
        question.kind === 'texteATrous'
            ? question.acceptableAnswersWithPoints.map((acceptableAnswer) => {
                  const splitAcceptableAnswers = acceptableAnswer.split('|');
                  return splitAcceptableAnswers
                      .map(acceptableAnswerParser.parse)
                      .map(({ points, answer }) => {
                          const decodedAnswer = encoder.base64ToString(answer);
                          return { points, answer: decodedAnswer };
                      });
              })
            : [
                  question.acceptableAnswersWithPoints.map((acceptableAnswer) => {
                      const { points, answer } = acceptableAnswerParser.parse(acceptableAnswer);
                      const decodedAnswer = encoder.base64ToString(answer);
                      return { points, answer: decodedAnswer };
                  }),
              ];
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.base64ToString(answer)),
        acceptableAnswersWithPoints,
    };
}

function encodeQuestion(question: questionDtoType): Omit<Question, 'exercise'> {
    const acceptableAnswersWithPoints =
        question.kind === 'texteATrous'
            ? question.acceptableAnswersWithPoints.map((blankAcceptableAnswers) => {
                  return blankAcceptableAnswers
                      .map((blankAcceptableAnswer) => {
                          const encodedAnswer = encoder.stringToBase64(
                              blankAcceptableAnswer.answer,
                          );

                          return acceptableAnswerParser.stringify({
                              points: blankAcceptableAnswer.points,
                              answer: encodedAnswer,
                          });
                      })
                      .join('|');
              })
            : question.acceptableAnswersWithPoints[0].map((acceptableAnswerWithPoints) => {
                  const encodedAnswer = encoder.stringToBase64(acceptableAnswerWithPoints.answer);
                  return acceptableAnswerParser.stringify({
                      points: acceptableAnswerWithPoints.points,
                      answer: encodedAnswer,
                  });
              });
    return {
        ...question,
        possibleAnswers: question.possibleAnswers.map((answer) => encoder.stringToBase64(answer)),
        acceptableAnswersWithPoints,
    };
}

export { questionEncoder };
