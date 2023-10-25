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
    const prevWords = prevTitle.split(' ');
    const replacedWord = prevWords[wordIndex];
    const nextWords = [...prevWords];
    nextWords[wordIndex] = '....';
    const nextTitle = nextWords.join(' ');

    const nextRightAnswers = [...prevRightAnswers];
    const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevTitle);
    nextRightAnswers.splice(rightAnswerIndex, 0, replacedWord);
    return { nextTitle, nextRightAnswers };
}

function computeRightAnswerIndex(wordIndex: number, prevTitle: string) {
    const words = prevTitle.split(' ');
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
