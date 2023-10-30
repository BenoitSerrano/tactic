import { Exam } from '../exam';
import { Question } from './Question.entity';
import { buildQuestionService } from './question.service';

export { buildQuestionController };

function buildQuestionController() {
    const questionService = buildQuestionService();
    const questionController = {
        createQuestion,
        updateQuestion,
        addQuestionRightAnswer,
        addQuestionAcceptableAnswer,
        removeOkAnswer,
        deleteQuestion,
        swapQuestions,
    };

    return questionController;

    async function createQuestion(params: {
        urlParams: { exerciseId: string };
        body: Pick<
            Question,
            'title' | 'kind' | 'points' | 'possibleAnswers' | 'rightAnswers' | 'acceptableAnswers'
        >;
    }) {
        return questionService.createQuestion(Number(params.urlParams.exerciseId), params.body);
    }

    async function updateQuestion(params: {
        urlParams: { exerciseId: string; questionId: string };
        body: Pick<
            Question,
            'title' | 'points' | 'possibleAnswers' | 'rightAnswers' | 'acceptableAnswers'
        >;
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
                rightAnswers: params.body.rightAnswers,
                points: params.body.points,
            },
        );
    }

    async function addQuestionRightAnswer(params: {
        urlParams: { questionId: string };
        body: { rightAnswer: string };
    }) {
        return questionService.addQuestionRightAnswer(
            {
                questionId: Number(params.urlParams.questionId),
            },
            params.body.rightAnswer,
        );
    }

    async function addQuestionAcceptableAnswer(params: {
        urlParams: { questionId: string };
        body: { acceptableAnswer: string };
    }) {
        return questionService.addQuestionAcceptableAnswer(
            {
                questionId: Number(params.urlParams.questionId),
            },
            params.body.acceptableAnswer,
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

    async function deleteQuestion(params: { urlParams: { questionId: string } }) {
        return questionService.deleteQuestion(Number(params.urlParams.questionId));
    }

    async function swapQuestions(params: {
        body: { questionId1: Question['id']; questionId2: Question['id'] };
    }) {
        return questionService.swapQuestions(params.body.questionId1, params.body.questionId2);
    }
}
