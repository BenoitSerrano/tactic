import { TAT_BLANK_STRING } from '../../../../../../constants';
import { acceptableAnswerType } from '../../../../../../types';

type chunkType = { kind: 'text'; value: string } | { kind: 'rightAnswerText'; words: string[] };

function computeDisplayedTitle(
    title: string,
    acceptableAnswers: acceptableAnswerType[][],
): Array<chunkType> {
    const displayedTitle: Array<chunkType> = [];
    let answerIndex = 0;
    const words = title.split(' ');
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex];
        if (word === TAT_BLANK_STRING) {
            const words = acceptableAnswers[answerIndex]
                .filter(({ grade }) => grade === 'A')[0]
                .answer.split(' ');
            displayedTitle.push({
                kind: 'rightAnswerText',
                words,
            });
            answerIndex++;
        } else {
            displayedTitle.push({
                kind: 'text',
                value: word,
            });
        }
    }

    return displayedTitle;
}

export { computeDisplayedTitle };
