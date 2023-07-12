import { buildPhraseMelangeeService } from './phraseMelangee.service';

export { buildPhraseMelangeeController };

function buildPhraseMelangeeController() {
    const phraseMelangeeService = buildPhraseMelangeeService();
    const phraseMelangeeController = {
        createPhraseMelangee,
        updatePhraseMelangee,
    };

    return phraseMelangeeController;

    async function createPhraseMelangee(params: { urlParams: { examId: string } }) {
        return phraseMelangeeService.createPhraseMelangee(params.urlParams.examId);
    }

    async function updatePhraseMelangee(params: {
        urlParams: { examId: string; phraseMelangeeId: string };
        body: {
            shuffledCombination?: number[];
            words?: string[];
        };
    }) {
        return phraseMelangeeService.updatePhraseMelangee({
            examId: params.urlParams.examId,
            phraseMelangeeId: Number(params.urlParams.phraseMelangeeId),
            shuffledCombination: params.body.shuffledCombination,
            words: params.body.words,
        });
    }
}
