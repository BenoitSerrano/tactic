import { QUESTION_TROU_REGEX } from '../../../constants';
import { textSplitter } from '../../../lib/textSplitter';
import { acceptableAnswerWithPointsType, questionKindType } from '../../../types';

function computeIsConfirmDisabled(
    questionKind: questionKindType,
    params: {
        title: string;
        possibleAnswers: string[];
        acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
    },
) {
    if (!params.title) {
        return true;
    }

    if (questionKind === 'texteLibre') {
        return false;
    }

    if (params.acceptableAnswersWithPoints.length === 0) {
        return true;
    }
    if (
        questionKind === 'qcm' &&
        (params.possibleAnswers.some((possibleAnswer) => !possibleAnswer) ||
            params.possibleAnswers.length <= 1)
    ) {
        return true;
    }

    if (questionKind === 'questionTrou' && !params.title.match(QUESTION_TROU_REGEX)) {
        return true;
    }

    if (
        questionKind === 'phraseMelangee' &&
        params.acceptableAnswersWithPoints[0].answer === params.title
    ) {
        return true;
    }

    if (questionKind === 'texteATrous') {
        const blankCount = textSplitter
            .split(params.title)
            .filter((word) => word === '....').length;
        if (blankCount === 0) {
            return true;
        }
        if (blankCount !== params.acceptableAnswersWithPoints.length) {
            return true;
        }
    }
    return false;
}

export { computeIsConfirmDisabled };
