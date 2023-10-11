import { PhraseMelangee, phraseMelangeeAnswersType } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';

const phraseMelangeeAdaptator = {
    computePhraseMelangeeSummary,
};

type phraseMelangeeSummaryType = Record<
    number,
    {
        status: 'right' | 'wrong';
        answer: string | undefined;
        points: number;
    }
>;

function computePhraseMelangeeSummary(
    answers: phraseMelangeeAnswersType,
    phrasesMelangees: PhraseMelangee[],
): phraseMelangeeSummaryType {
    const phraseMelangeeAnswerSummary = {} as phraseMelangeeSummaryType;
    phrasesMelangees.forEach((phraseMelangee) => {
        if (!answers[phraseMelangee.id]) {
            phraseMelangeeAnswerSummary[phraseMelangee.id] = {
                status: 'wrong',
                answer: undefined,
                points: phraseMelangee.points,
            };
            return;
        }
        const answer = answers[phraseMelangee.id];

        phraseMelangeeAnswerSummary[phraseMelangee.id] = {
            status: phraseMelangee.correctPhrases.includes(answer) ? 'right' : 'wrong',
            points: phraseMelangee.points,
            answer,
        };
    });
    return phraseMelangeeAnswerSummary;
}

export { phraseMelangeeAdaptator };
