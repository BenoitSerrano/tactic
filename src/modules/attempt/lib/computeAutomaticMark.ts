import { sanitizer } from '../../../lib/sanitizer';
import { textSplitter } from '../../question/lib/textSplitter';
import { convertGradeToMark } from '../../question/lib/convertGradeToMark';
import { gradeType, questionDtoType } from '../../question/types';

export { computeAutomaticMark };

function computeAutomaticMark({
    questionDto,
    answer,
}: {
    questionDto: questionDtoType;
    answer: string | undefined;
}): { mark: number; grade?: gradeType } {
    if (!answer) {
        return { mark: 0, grade: 'E' };
    }
    if (questionDto.kind === 'texteATrous') {
        const chunks = answer.split('|');
        const blankCount = textSplitter.countBlanks(questionDto.title);

        if (chunks.length !== questionDto.acceptableAnswers.length) {
            throw new Error(
                `The answer "${answer}" for questionId ${questionDto.id} does not have the same number of chunks (${chunks.length}) as acceptableAnswers (${questionDto.acceptableAnswers.length})`,
            );
        }

        const mark = chunks.reduce((totalMark, word, index) => {
            for (const acceptableAnswerPerBlank of questionDto.acceptableAnswers[index]) {
                const { grade, answer: answerForBlank } = acceptableAnswerPerBlank;
                const totalPointsPerBlank = questionDto.points / blankCount;
                const markForBlank = convertGradeToMark(grade, totalPointsPerBlank);
                if (sanitizer.sanitizeString(word) === sanitizer.sanitizeString(answerForBlank)) {
                    return totalMark + markForBlank;
                }
            }
            return totalMark;
        }, 0);
        return { mark };
    }
    if (questionDto.acceptableAnswers[0].length === 0) {
        throw new Error(`Cannot compute automatic mark for acceptableAnswers=[]`);
    }
    if (answer === undefined) {
        return { mark: 0, grade: 'E' };
    }
    const matchingAcceptableAnswer = questionDto.acceptableAnswers[0].find(
        (acceptableAnswer) =>
            sanitizer.sanitizeString(acceptableAnswer.answer) === sanitizer.sanitizeString(answer),
    );
    if (matchingAcceptableAnswer) {
        const mark = convertGradeToMark(matchingAcceptableAnswer.grade, questionDto.points);
        return { grade: matchingAcceptableAnswer.grade, mark };
    } else {
        return { mark: 0, grade: 'E' };
    }
}
