import { buildPhraseMelangeeAnswerService } from './phraseMelangeeAnswer.service';

export { buildPhraseMelangeeAnswerController };

function buildPhraseMelangeeAnswerController() {
    const phraseMelangeeAnswerService = buildPhraseMelangeeAnswerService();
    const phraseMelangeeAnswerController = {
        createOrUpdatePhraseMelangeeAnswer,
    };

    return phraseMelangeeAnswerController;

    async function createOrUpdatePhraseMelangeeAnswer(params: {
        urlParams: { attemptId: string; phraseMelangeeId: string };
        body: { combination: number[] };
    }) {
        return phraseMelangeeAnswerService.createOrUpdatePhraseMelangeeAnswer(
            params.urlParams.attemptId,
            Number(params.urlParams.phraseMelangeeId),
            params.body.combination,
        );
    }
}
