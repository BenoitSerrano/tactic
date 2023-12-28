import { sanitizer } from '../../../lib/sanitizer';
import { Question } from '../Question.entity';
import { acceptableAnswerType } from '../types';
import { questionEncoder } from './questionEncoder';

function addAcceptableAnswerToQuestion(question: Question, acceptableAnswer: acceptableAnswerType) {
    const decodedQuestion = questionEncoder.decodeQuestion(question);
    const sanitizedAcceptableAnswer = sanitizer.sanitizeString(acceptableAnswer.answer);
    const currentParsedAcceptableAnswers = decodedQuestion.acceptableAnswers[0];

    const alreadyPresentAcceptableAnswerIndex = currentParsedAcceptableAnswers.findIndex(
        ({ answer }) => sanitizer.sanitizeString(answer) === sanitizedAcceptableAnswer,
    );
    if (alreadyPresentAcceptableAnswerIndex !== -1) {
        if (
            currentParsedAcceptableAnswers[alreadyPresentAcceptableAnswerIndex].grade ===
            acceptableAnswer.grade
        ) {
            throw new Error(
                `This answer ${sanitizedAcceptableAnswer} already exists for this grade (${acceptableAnswer.grade})`,
            );
        } else {
            decodedQuestion.acceptableAnswers[0][alreadyPresentAcceptableAnswerIndex] = {
                grade: acceptableAnswer.grade,
                answer: sanitizedAcceptableAnswer,
            };
            const encodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
            return encodedQuestion;
        }
    }

    decodedQuestion.acceptableAnswers = [
        [
            ...decodedQuestion.acceptableAnswers[0],
            { grade: acceptableAnswer.grade, answer: sanitizedAcceptableAnswer },
        ],
    ];

    const reEncodedQuestion = questionEncoder.encodeQuestion(decodedQuestion);
    return reEncodedQuestion;
}

export { addAcceptableAnswerToQuestion };
