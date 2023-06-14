import { buildQuestionChoixMultipleService } from './questionChoixMultiple.service';

export { buildQuestionChoixMultipleController };

function buildQuestionChoixMultipleController() {
    const questionChoixMultipleService = buildQuestionChoixMultipleService();
    const questionChoixMultipleController = {
        createQuestionChoixMultiple,
    };

    return questionChoixMultipleController;

    async function createQuestionChoixMultiple(params: { urlParams: { examId: string } }) {
        return questionChoixMultipleService.createQuestionChoixMultiple(params.urlParams.examId);
    }
}
