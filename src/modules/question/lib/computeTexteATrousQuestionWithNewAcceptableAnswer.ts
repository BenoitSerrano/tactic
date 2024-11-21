import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerType } from '../types';
import { questionEncoder } from './questionEncoder';

function computeTexteATrousQuestionWithNewAcceptableAnswer(
    question: Question,
    body: { acceptableAnswer: acceptableAnswerType; blankIndex: number },
) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(body.acceptableAnswer.answer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers[body.blankIndex];

    const alreadyPresentAcceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedAcceptableAnswer,
    );
    if (alreadyPresentAcceptableAnswerIndex !== -1) {
        if (
            currentParsedAcceptableAnswers[alreadyPresentAcceptableAnswerIndex].grade ===
            body.acceptableAnswer.grade
        ) {
            throw new Error(
                `This answer ${sanitizedAcceptableAnswer} already exists for this grade (${body.acceptableAnswer.grade})`,
            );
        } else {
            decodedQuestion.acceptableAnswers[body.blankIndex][
                alreadyPresentAcceptableAnswerIndex
            ] = {
                grade: body.acceptableAnswer.grade,
                answer: sanitizedAcceptableAnswer,
            };
            const encodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
            return encodedQuestion;
        }
    }

    const newAcceptableAnswer = {
        grade: body.acceptableAnswer.grade,
        answer: sanitizedAcceptableAnswer,
    };

    decodedQuestion.acceptableAnswers[body.blankIndex] = [
        ...decodedQuestion.acceptableAnswers[body.blankIndex],
        newAcceptableAnswer,
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { computeTexteATrousQuestionWithNewAcceptableAnswer };
