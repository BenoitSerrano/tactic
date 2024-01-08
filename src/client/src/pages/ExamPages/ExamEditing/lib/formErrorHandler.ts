import { textSplitter } from '../../../../lib/textSplitter';
import { acceptableAnswerType, questionKindType } from '../../../../types';

const formErrorHandler = {
    computeFormErrors,
    extractPossibleAnswerFormErrorMessage,
    extractTitleFormErrorMessage,
    extractPointsFormErrorMessage,
    extractAcceptableShuffledPhraseFormErrorMessage,
    extractAcceptableAnswerEmptyFormErrorMessage,
};

function computeFormErrors(
    questionKind: questionKindType,
    params: {
        title: string;
        possibleAnswers: string[];
        acceptableAnswers: acceptableAnswerType[][];
        points: number;
    },
) {
    const formErrors: string[] = [];
    if (isNaN(params.points) || params.points <= 0) {
        formErrors.push('POINTS_SHOULD_BE_POSITIVE');
    }

    if (!params.title) {
        formErrors.push('NO_TITLE');
    }

    if (questionKind === 'texteLibre') {
        return formErrors;
    }

    if (questionKind === 'qcm' && params.possibleAnswers.length <= 1) {
        formErrors.push('ONLY_ONE_POSSIBLE_ANSWER');
    }

    if (questionKind === 'qcm') {
        const emptyPossibleAnswers = params.possibleAnswers.reduce(
            (acc, possibleAnswer, index) => (possibleAnswer === '' ? [...acc, index] : acc),
            [] as number[],
        );
        for (const possibleAnswerIndex of emptyPossibleAnswers) {
            formErrors.push(`EMPTY_POSSIBLE_ANSWER_${possibleAnswerIndex}`);
        }
    }

    if (params.acceptableAnswers.length === 0 || params.acceptableAnswers[0].length === 0) {
        formErrors.push('NO_RIGHT_ANSWER');
        return formErrors;
    }
    params.acceptableAnswers[0].forEach((acceptableAnswer, acceptableAnswerIndex) => {
        if (!acceptableAnswer.answer) {
            formErrors.push(`ACCEPTABLE_ANSWER_EMPTY_${acceptableAnswerIndex}`);
        }
    });

    if (questionKind === 'phraseMelangee') {
        const acceptableShuffledPhraseIndex = params.acceptableAnswers[0].findIndex(
            (acceptableAnswer) => acceptableAnswer.answer === params.title,
        );
        if (acceptableShuffledPhraseIndex !== -1) {
            formErrors.push(
                `SHUFFLED_PHRASE_SHOULD_NOT_BE_ACCEPTABLE_${acceptableShuffledPhraseIndex}`,
            );
        }
    }

    if (questionKind === 'texteATrous') {
        const blankCount = textSplitter
            .split(params.title)
            .filter((word) => word === '....').length;
        if (blankCount === 0) {
            formErrors.push('NO_BLANKS');
        } else if (blankCount !== params.acceptableAnswers.length) {
            formErrors.push('BLANK_RIGHT_ANSWERS_MISMATCH');
        }
    }
    return formErrors;
}
function extractPossibleAnswerFormErrorMessage(formErrors: string[], possibleAnswerIndex: number) {
    const FORM_ERROR_REGEX = new RegExp(`^EMPTY_POSSIBLE_ANSWER_${possibleAnswerIndex}+$`);
    const formErrorMatch = formErrors.find((formError) => formError.match(FORM_ERROR_REGEX));
    if (formErrorMatch) {
        return `Veuillez saisir une réponse possible dans ce champ`;
    }
    return undefined;
}

function extractTitleFormErrorMessage(formErrors: string[]) {
    const formError = formErrors.find((formError) => formError === 'NO_TITLE');
    if (formError !== undefined) {
        return `Veuillez saisir l'intitulé de la question dans ce champ`;
    }
    return undefined;
}

function extractPointsFormErrorMessage(formErrors: string[]) {
    const formError = formErrors.find((formError) => formError === 'POINTS_SHOULD_BE_POSITIVE');
    if (formError !== undefined) {
        return `Mauvaise valeur`;
    }
    return undefined;
}

function extractAcceptableShuffledPhraseFormErrorMessage(
    formErrors: string[],
    acceptableAnswerIndex: number,
) {
    const FORM_ERROR_REGEX = new RegExp(
        `^SHUFFLED_PHRASE_SHOULD_NOT_BE_ACCEPTABLE_${acceptableAnswerIndex}+$`,
    );
    const formErrorMatch = formErrors.find((formError) => formError.match(FORM_ERROR_REGEX));
    if (formErrorMatch) {
        return `L'intitulé de la question ne peut pas figurer parmi les réponses acceptées`;
    }
    return undefined;
}

function extractAcceptableAnswerEmptyFormErrorMessage(
    formErrors: string[],
    acceptableAnswerIndex: number,
) {
    const FORM_ERROR_REGEX = new RegExp(`^ACCEPTABLE_ANSWER_EMPTY_${acceptableAnswerIndex}+$`);
    const formErrorMatch = formErrors.find((formError) => formError.match(FORM_ERROR_REGEX));
    if (formErrorMatch) {
        return `Veuillez saisir une réponse dans ce champ`;
    }
    return undefined;
}

export { formErrorHandler };
