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
            rightCombination?: number[];
            words?: string[];
        };
    }) {
        return phraseMelangeeService.updatePhraseMelangee({
            examId: params.urlParams.examId,
            phraseMelangeeId: Number(params.urlParams.phraseMelangeeId),
            rightCombination: params.body.rightCombination,
            words: params.body.words,
        });
    }
}
