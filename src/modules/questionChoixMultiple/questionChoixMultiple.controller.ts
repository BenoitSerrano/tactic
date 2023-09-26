import { buildQuestionChoixMultipleService } from './questionChoixMultiple.service';

export { buildQuestionChoixMultipleController };

function buildQuestionChoixMultipleController() {
    const questionChoixMultipleService = buildQuestionChoixMultipleService();
    const questionChoixMultipleController = {
        createQuestionChoixMultiple,
        updateQuestionChoixMultiple,
    };

    return questionChoixMultipleController;

    async function createQuestionChoixMultiple(params: {
        urlParams: { examId: string };
        body: {
            title: string;
            possibleAnswers: string[];
            rightAnswerIndex: number;
            points: number;
        };
    }) {
        return questionChoixMultipleService.createQuestionChoixMultiple(
            params.urlParams.examId,
            params.body,
        );
    }

    async function updateQuestionChoixMultiple(params: {
        urlParams: { examId: string; qcmId: string };
        body: {
            title: string;
            possibleAnswers: string[];
            rightAnswerIndex: number;
            points: number;
        };
    }) {
        return questionChoixMultipleService.updateQuestionChoixMultiple({
            examId: params.urlParams.examId,
            qcmId: Number(params.urlParams.qcmId),
            title: params.body.title,
            possibleAnswers: params.body.possibleAnswers,
            rightAnswerIndex: Number(params.body.rightAnswerIndex),
            points: params.body.points,
        });
    }
}
