import { textSplitter } from '../../../../lib/textSplitter';
import { acceptableAnswerType, questionKindType } from '../../../../types';

const formErrorHandler = {
    computeFormErrors,
    extractPossibleAnswerFormErrorMessage,
    extractTitleFormErrorMessage,
    extractPointsFormErrorMessage,
    extractAcceptableShuffledPhraseFormErrorMessage,
    extractAcceptableAnswerEmptyFormErrorMessage,
    extractPointsPerBlankFormErrorMessage,
    extractRightAnswerPresenceFormErrorMessageForTaT,
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

    if (!params.title) {
        formErrors.push('NO_TITLE');
    }
    switch (questionKind) {
        case 'texteLibre':
            if (!arePointsPositive(params.points)) {
                formErrors.push('POINTS_SHOULD_BE_POSITIVE');
            }
            return formErrors;
        case 'qcm':
            if (!arePointsPositive(params.points)) {
                formErrors.push('POINTS_SHOULD_BE_POSITIVE');
            }
            if (params.possibleAnswers.length <= 1) {
                formErrors.push('ONLY_ONE_POSSIBLE_ANSWER');
            }
            const emptyPossibleAnswers = params.possibleAnswers.reduce(
                (acc, possibleAnswer, index) => (possibleAnswer === '' ? [...acc, index] : acc),
                [] as number[],
            );
            for (const possibleAnswerIndex of emptyPossibleAnswers) {
                formErrors.push(`EMPTY_POSSIBLE_ANSWER_${possibleAnswerIndex}`);
            }
            if (!areThereAcceptableAnswers(params.acceptableAnswers)) {
                formErrors.push('NO_RIGHT_ANSWER');
                return formErrors;
            }
            break;
        case 'phraseMelangee':
            if (!arePointsPositive(params.points)) {
                formErrors.push('POINTS_SHOULD_BE_POSITIVE');
            }
            if (!areThereAcceptableAnswers(params.acceptableAnswers)) {
                formErrors.push('NO_RIGHT_ANSWER');
                return formErrors;
            }
            const acceptableShuffledPhraseIndex = computeAcceptableShuffledPhraseIndex(
                params.title,
                params.acceptableAnswers,
            );
            if (acceptableShuffledPhraseIndex !== -1) {
                formErrors.push(
                    `SHUFFLED_PHRASE_SHOULD_NOT_BE_ACCEPTABLE_${acceptableShuffledPhraseIndex}`,
                );
            }

            break;
        case 'texteATrous':
            if (!areThereAcceptableAnswers(params.acceptableAnswers)) {
                formErrors.push('NO_RIGHT_ANSWER');
                return formErrors;
            }
            if (!arePointsPositive(params.points)) {
                formErrors.push('POINTS_SHOULD_BE_POSITIVE');
            }
            if (!areBlanksConsistent(params.title, params.acceptableAnswers)) {
                formErrors.push('BLANK_RIGHT_ANSWERS_MISMATCH');
            }
            break;
        default:
            if (!arePointsPositive(params.points)) {
                formErrors.push('POINTS_SHOULD_BE_POSITIVE');
            }
            if (!areThereAcceptableAnswers(params.acceptableAnswers)) {
                formErrors.push('NO_RIGHT_ANSWER');
                return formErrors;
            }
    }

    params.acceptableAnswers[0].forEach((acceptableAnswer, acceptableAnswerIndex) => {
        if (!acceptableAnswer.answer) {
            formErrors.push(`ACCEPTABLE_ANSWER_EMPTY_${acceptableAnswerIndex}`);
        }
    });
    return formErrors;
}

function computeAcceptableShuffledPhraseIndex(
    title: string,
    acceptableAnswers: acceptableAnswerType[][],
) {
    const acceptableShuffledPhraseIndex = acceptableAnswers[0].findIndex(
        (acceptableAnswer) => acceptableAnswer.answer === title,
    );
    return acceptableShuffledPhraseIndex;
}

function arePointsPositive(points: number) {
    return !isNaN(points) && points > 0;
}

function areThereAcceptableAnswers(acceptableAnswers: acceptableAnswerType[][]) {
    return acceptableAnswers.length > 0 && acceptableAnswers[0].length > 0;
}

function areBlanksConsistent(title: string, acceptableAnswers: acceptableAnswerType[][]) {
    const blankCount = textSplitter.countBlanks(title);
    return blankCount === acceptableAnswers.length;
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

function extractRightAnswerPresenceFormErrorMessageForTaT(formErrors: string[]) {
    const formError = formErrors.find((formError) => formError === 'NO_RIGHT_ANSWER');
    if (formError !== undefined) {
        return `Veuillez cliquer sur au moins un mot pour le transformer en trou`;
    }
    return undefined;
}

function extractPointsPerBlankFormErrorMessage(formErrors: string[]) {
    const formError = formErrors.find(
        (formError) => formError === 'POINTS_PER_BLANK_SHOULD_BE_POSITIVE',
    );
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
