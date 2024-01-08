type shuffledAnswerStateType = {
    alreadyPlacedWords: string[];
    remainingWordIndexesToPlace: number[];
};

function computeShuffledAnswerState(initialWords: string[], currentCombination: number[]) {
    const alreadyPlacedWords: string[] = [];

    for (const combinationIndex of currentCombination) {
        const wordToPlace = initialWords[combinationIndex];
        alreadyPlacedWords.push(wordToPlace);
    }

    const remainingWordIndexesToPlace = initialWords.reduce(
        (acc, _, wordIndex) => (currentCombination.includes(wordIndex) ? acc : [...acc, wordIndex]),
        [] as number[],
    );

    return { alreadyPlacedWords, remainingWordIndexesToPlace };
}

export { computeShuffledAnswerState };
export type { shuffledAnswerStateType };
