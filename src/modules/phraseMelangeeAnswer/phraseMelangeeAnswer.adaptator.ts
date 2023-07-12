import { PhraseMelangee } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';

const phraseMelangeeAdaptator = {
    computePhraseMelangeeSummary,
};

type phrasesMelangeesCombinationsType = Record<number, string[]>;

function computePhraseMelangeeSummary(
    phraseMelangeeAnswers: PhraseMelangeeAnswer[],
    phrasesMelangees: PhraseMelangee[],
) {
    const combinations: phrasesMelangeesCombinationsType = {};

    phraseMelangeeAnswers.forEach((phraseMelangeeAnswer) => {
        const id = phraseMelangeeAnswer.phraseMelangee.id;
        combinations[id] = phraseMelangeeAnswer.combination;
    });

    const phraseMelangeeAnswerSummary = {} as any;
    phrasesMelangees.forEach((phraseMelangee) => {
        if (!combinations[phraseMelangee.id]) {
            return {
                status: 'wrong' as const,
                combination: [],
            };
        }
        const combination = combinations[phraseMelangee.id].map(Number);
        const reconstitutedPhrase = computeReconstitutedPhrase(
            phraseMelangee.words,
            phraseMelangee.shuffledCombination.map(Number),
            combination,
        );
        phraseMelangeeAnswerSummary[phraseMelangee.id] = {
            status: reconstitutedPhrase === phraseMelangee.words.join(' ') ? 'right' : 'wrong',
            combination,
            reconstitutedPhrase,
        };
    });
    return phraseMelangeeAnswerSummary;
}

function computeReconstitutedPhrase(
    words: string[],
    shuffledCombination: number[],
    combination: number[],
) {
    const shuffledWords: string[] = [];
    shuffledCombination.forEach((index) => {
        shuffledWords.push(words[index]);
    });
    const reconstitutedWords: string[] = [];
    combination.forEach((index) => {
        reconstitutedWords.push(shuffledWords[index]);
    });
    return reconstitutedWords.join(' ');
}

export { phraseMelangeeAdaptator };
