import { TAT_BLANK_STRING } from '../../../constants';
import { textSplitter } from '../../../lib/textSplitter';

type texteATrousStateType = { title: string; rightAnswers: string[] };

function computeTexteATrousState(
    wordIndex: number,
    prevState: texteATrousStateType,
): texteATrousStateType {
    const prevWords = textSplitter.split(prevState.title);
    const replacedWord = prevWords[wordIndex];

    const nextWords = [...prevWords];
    const nextRightAnswers = [...prevState.rightAnswers];

    const rightAnswerIndex = computeRightAnswerIndex(wordIndex, prevState.title);
    if (replacedWord === TAT_BLANK_STRING) {
        nextWords[wordIndex] = prevState.rightAnswers[rightAnswerIndex];
        nextRightAnswers.splice(rightAnswerIndex, 1);
    } else {
        nextWords[wordIndex] = TAT_BLANK_STRING;
        nextRightAnswers.splice(rightAnswerIndex, 0, replacedWord);
    }
    const nextTitle = nextWords.join(' ');

    const nextState = { title: nextTitle, rightAnswers: nextRightAnswers };

    const mergedState = mergeAdjacentBlanks(nextState);

    return mergedState;
}

function computeRightAnswerIndex(wordIndex: number, title: string) {
    const words = textSplitter.split(title);
    let rightAnswerIndex = 0;
    for (let i = 0; i < wordIndex; i++) {
        const word = words[i];
        if (word === TAT_BLANK_STRING) {
            rightAnswerIndex++;
        }
    }
    return rightAnswerIndex;
}

function mergeAdjacentBlanks(prevState: texteATrousStateType): texteATrousStateType {
    const splittedText = textSplitter.split(prevState.title);

    let startedRightAnswer: string[] = [];
    let rightAnswerIndex = -1;
    const nextRightAnswers: string[] = [];
    let nextTitleChunks: string[] = [];
    for (let i = 0; i < splittedText.length; i++) {
        const word = splittedText[i];
        if (word === TAT_BLANK_STRING) {
            if (startedRightAnswer.length === 0) {
                nextTitleChunks.push(TAT_BLANK_STRING);
            }
            rightAnswerIndex++;
            const currentRightAnswer = prevState.rightAnswers[rightAnswerIndex];
            startedRightAnswer.push(currentRightAnswer);
        } else {
            if (startedRightAnswer.length > 0) {
                nextRightAnswers.push(startedRightAnswer.join(' '));
                startedRightAnswer = [];
            }
            nextTitleChunks.push(word);
        }
    }
    if (startedRightAnswer.length > 0) {
        nextRightAnswers.push(startedRightAnswer.join(' '));
        startedRightAnswer = [];
    }

    return { title: nextTitleChunks.join(' '), rightAnswers: nextRightAnswers };
}

export { computeTexteATrousState, computeRightAnswerIndex, mergeAdjacentBlanks };
