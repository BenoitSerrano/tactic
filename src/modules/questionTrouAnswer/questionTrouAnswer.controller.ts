import { buildQuestionTrouAnswerService } from './questionTrouAnswer.service';

export { buildQuestionTrouAnswerController };

function buildQuestionTrouAnswerController() {
    const questionTrouAnswerService = buildQuestionTrouAnswerService();
    const questionTrouAnswerController = {
        createOrUpdateQuestionTrouAnswer,
    };

    return questionTrouAnswerController;

    async function createOrUpdateQuestionTrouAnswer(params: {
        urlParams: { attemptId: string; questionTrouId: string };
        body: { answer: string };
    }) {
        return questionTrouAnswerService.createOrUpdateQuestionTrouAnswer(
            params.urlParams.attemptId,
            Number(params.urlParams.questionTrouId),
            params.body.answer,
        );
    }
}
