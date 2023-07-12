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
        phraseMelangeeAnswerSummary[phraseMelangee.id] = {
            combination: combinations[phraseMelangee.id]
                ? combinations[phraseMelangee.id].map((value) => Number(value))
                : [],
        };
    });
    return phraseMelangeeAnswerSummary;
}

export { phraseMelangeeAdaptator };
