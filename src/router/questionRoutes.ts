import Joi from 'joi';
import { buildQuestionController, questionKinds } from '../modules/question';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const questionController = buildQuestionController();

const questionRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'PUT',
        path: '/exams/:examId/exercises/:exerciseId/questions/:questionId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.updateQuestion,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            title: Joi.string().required(),
            possibleAnswers: Joi.array().items(Joi.string().allow('')).required(),
            acceptableAnswers: Joi.array()
                .items(
                    Joi.array().items(
                        Joi.object({
                            answer: Joi.string().allow(''),
                            grade: Joi.string()
                                .required()
                                .regex(/^[A-D]$/),
                        }),
                    ),
                )
                .required(),
            points: Joi.number().required(),
        }),
    },
    {
        method: 'PATCH',
        path: `/exams/:examId/exercises/:exerciseId/questions/order`,
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.updateQuestionsOrder,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            orderedIds: Joi.array().items(Joi.number().required()),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/questions/:questionId/acceptable-answers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.addAcceptableAnswerToQuestion,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            acceptableAnswer: Joi.object({
                answer: Joi.string().required(),
                grade: Joi.string()
                    .required()
                    .regex(/^[A-D]$/),
            }),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/questions/:questionId/tat-acceptable-answers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.addAcceptableAnswerToQuestionTexteATrous,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            blankIndex: Joi.number().required(),
            acceptableAnswer: Joi.object({
                answer: Joi.string().required(),
                grade: Joi.string()
                    .required()
                    .regex(/^[A-D]$/),
            }),
        }),
    },
    {
        method: 'POST',
        path: '/exams/:examId/exercises/:exerciseId/questions',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.createQuestion,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
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
                    Joi.array().items(
                        Joi.object({
                            answer: Joi.string().allow(''),
                            grade: Joi.string()
                                .required()
                                .regex(/^[A-D]$/),
                        }),
                    ),
                )
                .required(),
            points: Joi.number(),
        }),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/questions/:questionId/ok-answers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.removeOkAnswer,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({ okAnswer: Joi.string().required() }),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/questions/:questionId/tat-ok-answers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.removeOkAnswerFromQuestionTexteATrous,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            okAnswer: Joi.string().required(),
            blankIndex: Joi.number().required(),
        }),
    },
    {
        method: 'DELETE',
        path: `/exams/:examId/questions/:questionId`,
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: questionController.deleteQuestion,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
];

export { questionRoutes };
