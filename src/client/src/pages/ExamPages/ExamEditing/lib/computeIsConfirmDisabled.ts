import { TAT_BLANK_STRING } from '../../../../constants';
import { textSplitter } from '../../../../lib/textSplitter';
import { acceptableAnswerType, questionKindType } from '../../../../types';

function computeIsConfirmDisabled(
    questionKind: questionKindType,
    params: {
        title: string;
        possibleAnswers: string[];
        acceptableAnswers: acceptableAnswerType[][];
        points: number;
    },
) {
    if (!params.title) {
        return true;
    }

    if (isNaN(params.points) || !params.points) {
        return true;
    }

    if (questionKind === 'texteLibre') {
        return false;
    }

    if (params.acceptableAnswers.length === 0 || params.acceptableAnswers[0].length === 0) {
        return true;
    }
    if (
        questionKind === 'qcm' &&
        (params.possibleAnswers.some((possibleAnswer) => !possibleAnswer) ||
            params.possibleAnswers.length <= 1)
    ) {
        return true;
    }

    if (
        questionKind === 'phraseMelangee' &&
        params.acceptableAnswers[0][0].answer === params.title
    ) {
        return true;
    }

    if (questionKind === 'texteATrous') {
        const blankCount = textSplitter
            .split(params.title)
            .filter((word) => word === TAT_BLANK_STRING).length;
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
