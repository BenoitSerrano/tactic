import { textSplitter } from '../../../lib/textSplitter';

function computeTexteATrousState(
    wordIndex: number,
    {
        prevTitle,
        prevRightAnswers,
    }: {
        prevTitle: string;
        prevRightAnswers: string[];
    },
): { nextTitle: string; nextRightAnswers: string[] } {
    const prevWords = textSplitter.split(prevTitle);
    const replacedWord = prevWords[wordIndex];

    const nextWords = [...prevWords];
    const nextRightAnswers = [...prevRightAnswers];

    const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);
    if (replacedWord === '....') {
        nextWords[wordIndex] = prevRightAnswers[rightAnswerIndex];
        nextRightAnswers.splice(rightAnswerIndex, 1);
    } else {
        nextWords[wordIndex] = '....';
        nextRightAnswers.splice(rightAnswerIndex, 0, replacedWord);
    }
    const nextTitle = nextWords.join(' ');

    return { nextTitle, nextRightAnswers };
}

function computeRightAnswerIndex(wordIndex: number, title: string) {
    const words = textSplitter.split(title);
    let rightAnswerIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
        const word = words[i];
        if (word === '....') {
            rightAnswerIndex++;
        }
    }
    return rightAnswerIndex;
}

export { computeTexteATrousState, computeRightAnswerIndex };
