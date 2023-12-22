import Joi from 'joi';
import { buildQuestionController, questionKinds } from '../modules/question';
import { routeType } from './types';
import { accessControlBuilder } from '../lib/accessControlBuilder';

const questionController = buildQuestionController();

const questionRoutes: Array<routeType<any, any>> = [
    {
        method: 'PUT',
        path: '/exams/:examId/exercises/:exerciseId/questions/:questionId',
        isAuthenticated: true,
        controller: questionController.updateQuestion,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            title: Joi.string().required(),
            possibleAnswers: Joi.array().items(Joi.string().allow('')).required(),
            acceptableAnswers: Joi.array()
                .items(
                    Joi.object({ answer: Joi.string().allow(''), points: Joi.number().required() }),
                )
                .required(),
            points: Joi.number().required(),
        }),
    },
    {
        method: 'PATCH',
        path: `/exams/:examId/exercises/:exerciseId/questions/order`,
        isAuthenticated: true,
        controller: questionController.updateQuestionsOrder,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            orders: Joi.array().items(
                Joi.object({ id: Joi.number().required(), order: Joi.number().required() }),
            ),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/questions/:questionId/acceptable-answers',
        isAuthenticated: true,
        controller: questionController.addQuestionAcceptableAnswer,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            acceptableAnswer: Joi.object({
                answer: Joi.string().required(),
                points: Joi.number().required(),
            }),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/exercises/:exerciseId/questions',
        isAuthenticated: true,
        controller: questionController.createQuestion,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            title: Joi.string().allow(''),
            kind: Joi.string().valid(...questionKinds),
            possibleAnswers: Joi.array().items(Joi.string()),
            acceptableAnswers: Joi.array()
                .items(
                    Joi.object({ answer: Joi.string().allow(''), points: Joi.number().required() }),
                )
                .required(),
            points: Joi.number(),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/exercises/:exerciseId/questions/:questionId/duplicate',
        isAuthenticated: true,
        controller: questionController.duplicateQuestion,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/questions/:questionId/ok-answers',
        isAuthenticated: true,
        controller: questionController.removeOkAnswer,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({ okAnswer: Joi.string() }),
    },

    {
        method: 'DELETE',
        path: `/exams/:examId/questions/:questionId`,
        isAuthenticated: true,
        controller: questionController.deleteQuestion,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
];

export { questionRoutes };
