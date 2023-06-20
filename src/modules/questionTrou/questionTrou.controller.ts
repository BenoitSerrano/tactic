import { buildQuestionTrouService } from './questionTrou.service';

export { buildQuestionTrouController };

function buildQuestionTrouController() {
    const questionTrouService = buildQuestionTrouService();
    const questionTrouController = {
        createQuestionTrou,
        // updateQuestionTrou,
    };

    return questionTrouController;

    async function createQuestionTrou(params: { urlParams: { examId: string } }) {
        return questionTrouService.createQuestionTrou(params.urlParams.examId);
    }

    // async function updateQuestionTrou(params: {
    //     urlParams: { examId: string; qcmId: string };
    //     body: { title: string; possibleAnswers: string[]; rightAnswerIndex: string };
    // }) {
    //     return questionTrouService.updateQuestionTrou({
    //         examId: params.urlParams.examId,
    //         qcmId: Number(params.urlParams.qcmId),
    //         title: params.body.title,
    //         possibleAnswers: params.body.possibleAnswers,
    //         rightAnswerIndex: Number(params.body.rightAnswerIndex),
    //     });
    // }
}
