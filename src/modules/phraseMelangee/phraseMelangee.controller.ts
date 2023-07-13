import { buildPhraseMelangeeService } from './phraseMelangee.service';

export { buildPhraseMelangeeController };

function buildPhraseMelangeeController() {
    const phraseMelangeeService = buildPhraseMelangeeService();
    const phraseMelangeeController = {
        createPhraseMelangee,
        updatePhraseMelangee,
    };

    return phraseMelangeeController;

    async function createPhraseMelangee(params: {
        urlParams: { examId: string };
        body: {
            shuffledPhrase: string;
            words: string[];
            correctPhrases: string[];
        };
    }) {
        return phraseMelangeeService.createPhraseMelangee(params.urlParams.examId, params.body);
    }

    async function updatePhraseMelangee(params: {
        urlParams: { examId: string; phraseMelangeeId: string };
        body: {
            shuffledPhrase: string;
            words: string[];
            correctPhrases: string[];
        };
    }) {
        return phraseMelangeeService.updatePhraseMelangee({
            examId: params.urlParams.examId,
            phraseMelangeeId: Number(params.urlParams.phraseMelangeeId),
            shuffledPhrase: params.body.shuffledPhrase,
            correctPhrases: params.body.correctPhrases,
            words: params.body.words,
        });
    }
}
