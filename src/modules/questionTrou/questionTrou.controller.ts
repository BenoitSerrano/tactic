import { buildQuestionTrouService } from './questionTrou.service';

export { buildQuestionTrouController };

function buildQuestionTrouController() {
    const questionTrouService = buildQuestionTrouService();
    const questionTrouController = {
        createQuestionTrou,
        updateQuestionTrou,
    };

    return questionTrouController;

    async function createQuestionTrou(params: {
        urlParams: { examId: string };
        body: {
            beforeText: string;
            afterText: string;
            rightAnswers: string[];
            acceptableAnswers: string[];
            points: number;
        };
    }) {
        return questionTrouService.createQuestionTrou(params.urlParams.examId, params.body);
    }

    async function updateQuestionTrou(params: {
        urlParams: { examId: string; questionTrouId: string };
        body: {
            beforeText: string;
            afterText: string;
            rightAnswers: string[];
            acceptableAnswers: string[];
            points: number;
        };
    }) {
        return questionTrouService.updateQuestionTrou({
            examId: params.urlParams.examId,
            questionTrouId: Number(params.urlParams.questionTrouId),
            beforeText: params.body.beforeText,
            afterText: params.body.afterText,
            acceptableAnswers: params.body.acceptableAnswers,
            rightAnswers: params.body.rightAnswers,
            points: params.body.points,
        });
    }
}
