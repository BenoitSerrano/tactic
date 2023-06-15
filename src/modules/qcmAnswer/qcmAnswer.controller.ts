import { buildQcmAnswerService } from './qcmAnswer.service';

export { buildQcmAnswerController };

function buildQcmAnswerController() {
    const qcmAnswerService = buildQcmAnswerService();
    const qcmAnswerController = {
        createOrUpdateQcmAnswer,
    };

    return qcmAnswerController;

    async function createOrUpdateQcmAnswer(params: {
        urlParams: { attemptId: string; qcmId: string };
        body: { choice: number };
    }) {
        return qcmAnswerService.createOrUpdateQcmAnswer(
            params.urlParams.attemptId,
            Number(params.urlParams.qcmId),
            params.body.choice,
        );
    }
}
