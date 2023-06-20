import { buildQuestionTrouService } from './questionTrou.service';

export { buildQuestionTrouController };

function buildQuestionTrouController() {
    const questionTrouService = buildQuestionTrouService();
    const questionTrouController = {
        createQuestionTrou,
        updateQuestionTrou,
    };

    return questionTrouController;

    async function createQuestionTrou(params: { urlParams: { examId: string } }) {
        return questionTrouService.createQuestionTrou(params.urlParams.examId);
    }

    async function updateQuestionTrou(params: {
        urlParams: { examId: string; questionTrouId: string };
        body: {
            beforeText: string;
            afterText: string;
            rightAnswer: string;
            acceptableAnswers: string[];
        };
    }) {
        return questionTrouService.updateQuestionTrou({
            examId: params.urlParams.examId,
            questionTrouId: Number(params.urlParams.questionTrouId),
            beforeText: params.body.beforeText,
            afterText: params.body.afterText,
            acceptableAnswers: params.body.acceptableAnswers,
            rightAnswer: params.body.rightAnswer,
        });
    }
}
