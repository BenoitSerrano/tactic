const converter = {
    convertTextInputToAnswer,
    convertWordIndexToAnswerIndex,
    convertAnswerToTextInputs,
};

function convertTextInputToAnswer({
    textInput,
    wordIndex,
    currentAnswer,
    title,
}: {
    textInput: string;
    wordIndex: number;
    currentAnswer: string;
    title: string;
}) {
    let newAnswer: string[];
    if (!currentAnswer) {
        const blankCount = computeBlankCount(title);
        newAnswer = ' '.repeat(blankCount - 1).split(' ');
    } else {
        newAnswer = currentAnswer.split(' ');
    }
    const blankIndex = computeBlankIndex(wordIndex, title);
    newAnswer[blankIndex] = textInput;

    return newAnswer.join(' ');
}

function computeBlankIndex(wordIndex: number, title: string) {
    const words = title.split(' ');
    let blankIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
        const word = words[i];
        if (word === '....') {
            blankIndex++;
        }
    }
    return blankIndex;
}
function convertAnswerToTextInputs({
    currentAnswer,
    title,
}: {
    currentAnswer: string;
    title: string;
}) {
    const blankCount = computeBlankCount(title);
    if (!currentAnswer) {
        return ' '
            .repeat(blankCount)
            .split('')
            .map(() => '');
    }
    return currentAnswer.split(' ');
}

function convertWordIndexToAnswerIndex({ wordIndex, title }: { wordIndex: number; title: string }) {
    const words = title.split(' ');
    let answerIndex = 0;
    for (let i = 0, wordCount = words.length; i < wordCount; i++) {
        const word = words[i];
        if (word === '....') {
            if (i === wordIndex) {
                return answerIndex;
            } else {
                answerIndex++;
            }
        }
    }
    console.error(`ERROR: the word index ${wordIndex} is not a blank in title "${title}"`);
    return -1;
}

function computeBlankCount(title: string) {
    return title.split(' ').filter((word) => word === '....').length;
}

export { converter };
