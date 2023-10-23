import { QUESTION_TROU_REGEX } from '../../../constants';
import { questionKindType } from '../../../types';

function computeIsConfirmDisabled(
    questionKind: questionKindType,
    params: {
        title: string;
        rightAnswers: string[];
        possibleAnswers: string[];
        acceptableAnswers: string[];
    },
) {
    if (!params.title) {
        return true;
    }

    if (questionKind === 'texteLibre') {
        return false;
    }

    if (params.rightAnswers.length === 0) {
        return true;
    }
    if (
        questionKind === 'qcm' &&
        params.possibleAnswers.some((possibleAnswer) => !possibleAnswer)
    ) {
        return true;
    }

    if (questionKind === 'questionTrou' && !params.title.match(QUESTION_TROU_REGEX)) {
        return true;
    }

    if (questionKind === 'phraseMelangee' && params.title === params.rightAnswers[0]) {
        return true;
    }
    return false;
}

export { computeIsConfirmDisabled };
