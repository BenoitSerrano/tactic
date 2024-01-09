import { TEXTE_A_TROU_REGEX } from '../../../../../../constants';
import { acceptableAnswerType } from '../../../../../../types';

type chunkType = { kind: 'text'; value: string } | { kind: 'rightAnswerText'; value: string };

function computeDisplayedTitle(
    title: string,
    acceptableAnswers: acceptableAnswerType[][],
): Array<chunkType> {
    const tATRegexMatch = title.matchAll(TEXTE_A_TROU_REGEX);
    let value = tATRegexMatch.next();
    if (!!value.done) {
        return [{ kind: 'text', value: title }];
    }
    const displayedTitle: Array<chunkType> = [];
    let lastIndexFound = 0;
    let answerIndex = 0;
    while (!value.done) {
        displayedTitle.push({
            kind: 'text',
            value: title.slice(lastIndexFound, value.value.index).trim(),
        });

        displayedTitle.push({
            kind: 'rightAnswerText',
            value: acceptableAnswers[answerIndex].filter(({ grade }) => grade === 'A')[0].answer,
        });
        lastIndexFound = (value.value.index || 0) + 4;
        value = tATRegexMatch.next();
        answerIndex++;
    }
    if (lastIndexFound < title.length - 1) {
        displayedTitle.push({ kind: 'text', value: title.slice(lastIndexFound).trim() });
    }
    return displayedTitle;
}

export { computeDisplayedTitle };
