import { Question } from './Question.entity';
import { buildQuestionService } from './question.service';
import { acceptableAnswerType, questionDtoType } from './types';

export { buildQuestionController };

function buildQuestionController() {
    const questionService = buildQuestionService();
    const questionController = {
        createQuestion,
        updateQuestion,
        duplicateQuestion,
        addQuestionAcceptableAnswer,
        addQuestionAcceptableAnswerToTexteATrous,
        removeOkAnswer,
        removeOkAnswerFromTexteATrous,
        deleteQuestion,
        updateQuestionsOrder,
    };

    return questionController;

    async function createQuestion(params: {
        urlParams: { exerciseId: string };
        body: Pick<
            questionDtoType,
            'title' | 'kind' | 'points' | 'possibleAnswers' | 'acceptableAnswers' | 'order'
        >;
    }) {
        return questionService.createQuestion(Number(params.urlParams.exerciseId), params.body);
    }

    async function updateQuestion(params: {
        urlParams: { exerciseId: string; questionId: string };
        body: Pick<questionDtoType, 'title' | 'points' | 'possibleAnswers' | 'acceptableAnswers'>;
    }) {
        return questionService.updateQuestion(
            {
                exerciseId: Number(params.urlParams.exerciseId),
                questionId: Number(params.urlParams.questionId),
            },
            {
                title: params.body.title,
                possibleAnswers: params.body.possibleAnswers,
                acceptableAnswers: params.body.acceptableAnswers,
                points: params.body.points,
            },
        );
    }

    async function addQuestionAcceptableAnswerToTexteATrous(params: {
        urlParams: { questionId: string };
        body: { blankIndex: number; acceptableAnswer: acceptableAnswerType };
    }) {
        return questionService.addQuestionAcceptableAnswerToTexteATrous(
            {
                questionId: Number(params.urlParams.questionId),
            },
            params.body,
        );
    }

    async function addQuestionAcceptableAnswer(params: {
        urlParams: { questionId: string };
        body: { acceptableAnswer: acceptableAnswerType };
    }) {
        return questionService.addQuestionAcceptableAnswer(
            {
                questionId: Number(params.urlParams.questionId),
            },
            {
                acceptableAnswer: params.body.acceptableAnswer,
            },
        );
    }

    async function removeOkAnswer(params: {
        urlParams: { questionId: string };
        body: { okAnswer: string };
    }) {
        return questionService.removeOkAnswer(
            {
                questionId: Number(params.urlParams.questionId),
            },
            params.body.okAnswer,
        );
    }

    async function removeOkAnswerFromTexteATrous(params: {
        urlParams: { questionId: string };
        body: { okAnswer: string; blankIndex: number };
    }) {
        return questionService.removeOkAnswerFromTexteATrous(
            {
                questionId: Number(params.urlParams.questionId),
            },
            params.body,
        );
    }

    async function deleteQuestion(params: { urlParams: { questionId: string } }) {
        return questionService.deleteQuestion(Number(params.urlParams.questionId));
    }

    async function updateQuestionsOrder(params: {
        body: { orders: Array<{ id: Question['id']; order: number }> };
    }) {
        return questionService.updateQuestionsOrder(params.body.orders);
    }

    async function duplicateQuestion(params: {
        urlParams: { questionId: string; exerciseId: number };
    }) {
        return questionService.duplicateQuestion(
            params.urlParams.exerciseId,
            Number(params.urlParams.questionId),
        );
    }
}
