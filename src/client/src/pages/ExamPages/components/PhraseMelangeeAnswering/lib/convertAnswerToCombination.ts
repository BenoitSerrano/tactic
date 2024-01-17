function convertAnswerToCombination(initialWords: string[], answer: string) {
    const answerWords = answer.split(' ');
    const combination: number[] = [];
    const foundWords: Record<string, number> = {};
    for (const answerWord of answerWords) {
        if (foundWords[answerWord] === undefined) {
            const wordIndex = initialWords.indexOf(answerWord);
            if (wordIndex === -1) {
                throw new Error(
                    `Error while converting answer ${answer} to combination for initialWords: [${initialWords.join(
                        ',',
                    )}]`,
                );
            } else {
                combination.push(wordIndex);
                foundWords[answerWord] = wordIndex;
            }
        } else {
            const wordIndex = initialWords.indexOf(answerWord, foundWords[answerWord] + 1);
            if (wordIndex === -1) {
                throw new Error(
                    `Error while converting answer ${answer} to combination for initialWords: [${initialWords.join(
                        ',',
                    )}]`,
                );
            } else {
                combination.push(wordIndex);
                foundWords[answerWord] = wordIndex;
            }
        }
    }
    return combination;
}

export { convertAnswerToCombination };
