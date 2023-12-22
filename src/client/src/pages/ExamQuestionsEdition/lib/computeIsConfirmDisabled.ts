import { textSplitter } from '../../../lib/textSplitter';
import { acceptableAnswerWithPointsType, questionKindType } from '../../../types';

function computeIsConfirmDisabled(
    questionKind: questionKindType,
    params: {
        title: string;
        possibleAnswers: string[];
        acceptableAnswers: acceptableAnswerWithPointsType[];
    },
) {
    if (!params.title) {
        return true;
    }

    if (questionKind === 'texteLibre') {
        return false;
    }

    if (params.acceptableAnswers.length === 0) {
        return true;
    }
    if (
        questionKind === 'qcm' &&
        (params.possibleAnswers.some((possibleAnswer) => !possibleAnswer) ||
            params.possibleAnswers.length <= 1)
    ) {
        return true;
    }

    if (questionKind === 'phraseMelangee' && params.acceptableAnswers[0].answer === params.title) {
        return true;
    }

    if (questionKind === 'texteATrous') {
        const blankCount = textSplitter
            .split(params.title)
            .filter((word) => word === '....').length;
        if (blankCount === 0) {
            return true;
        }
        if (blankCount !== params.acceptableAnswers.length) {
            return true;
        }
    }
    return false;
}

export { computeIsConfirmDisabled };
