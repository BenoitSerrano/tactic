const phraseMelangeeModule = {
    computeShuffledWords,
};

function computeShuffledWords(words: string[], shuffledCombination: number[]) {
    const shuffledWords = [];
    for (let i = 0; i < shuffledCombination.length; i++) {
        shuffledWords.push(words[shuffledCombination[i]]);
    }
    return shuffledWords;
}

export { phraseMelangeeModule };
