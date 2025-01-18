import { TAT_BLANK_STRING } from '../../../constants';
import { textSplitter } from '../../../lib/textSplitter';
import { acceptableAnswerType } from '../../../types';

const SPLITTING_CHARACTER_FOR_TAT = '|';

const converter = {
    convertTextInputToAnswer,
    convertWordIndexToAnswerIndex,
    convertAnswerToTextInputs,
    convertBlankedTitleToFullTitle,
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
        const blankCount = textSplitter.countBlanks(title);
        newAnswer = SPLITTING_CHARACTER_FOR_TAT.repeat(blankCount - 1).split(
            SPLITTING_CHARACTER_FOR_TAT,
        );
    } else {
        newAnswer = currentAnswer.split(SPLITTING_CHARACTER_FOR_TAT);
    }
    const blankIndex = computeBlankIndex(wordIndex, title);
    newAnswer[blankIndex] = textInput;

    return newAnswer.join(SPLITTING_CHARACTER_FOR_TAT);
}

function computeBlankIndex(wordIndex: number, title: string) {
    const words = textSplitter.split(title);
    let blankIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
        const word = words[i];
        if (word === TAT_BLANK_STRING) {
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
    const blankCount = textSplitter.countBlanks(title);
    if (!currentAnswer) {
        return SPLITTING_CHARACTER_FOR_TAT.repeat(blankCount)
            .split('')
            .map(() => '');
    }
    return currentAnswer.split(SPLITTING_CHARACTER_FOR_TAT);
}

function convertWordIndexToAnswerIndex({ wordIndex, title }: { wordIndex: number; title: string }) {
    const words = textSplitter.split(title);
    let answerIndex = 0;
    for (let i = 0, wordCount = words.length; i < wordCount; i++) {
        const word = words[i];
        if (word === TAT_BLANK_STRING) {
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

function convertBlankedTitleToFullTitle(
    blankedTitle: string,
    acceptableAnswers: acceptableAnswerType[][],
) {
    const blankCount = textSplitter.countBlanks(blankedTitle);
    let fullTitle = blankedTitle;
    if (blankCount !== acceptableAnswers.length) {
        console.error(
            `ERROR: discrepancy between title "${blankedTitle}" and acceptableAnswers lenth: ${acceptableAnswers.length}`,
        );
        return fullTitle;
    }
    for (let i = 0; i < blankCount; i++) {
        fullTitle = fullTitle.replace(TAT_BLANK_STRING, acceptableAnswers[i][0].answer);
    }
    return fullTitle;
}

export { converter, SPLITTING_CHARACTER_FOR_TAT };
