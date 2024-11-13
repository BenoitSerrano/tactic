import Joi from 'joi';
import { accessControlBuilder } from './lib/accessControlBuilder';
import { buildExamController } from '../modules/exam';
import { routeType } from './types';

const examController = buildExamController();

const examRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/establishments/:establishmentId/classes/:classeId/exams',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.getExamsByClasse,
    },
    {
        method: 'GET',
        path: '/exams',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.getExams,
    },
    {
        method: 'GET',
        path: '/users/:userId/exams',
        kind: 'authenticated',
        authorizedRoles: ['admin'],
        controller: examController.getExamsByUser,
    },
    {
        method: 'GET',
        path: '/all-exams',
        kind: 'public',
        controller: examController.getAllExams,
    },
    {
        method: 'GET',
        path: '/exams/:examId',
        kind: 'public',
        controller: examController.getExam,
    },
    {
        method: 'GET',
        path: '/exams/:examId/with-questions',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.getExamWithQuestions,
    },
    {
        method: 'GET',
        path: '/exams/:examId/without-answers',
        kind: 'public',
        controller: examController.getExamWithoutAnswers,
    },
    {
        method: 'GET',
        path: '/exams/:examId/results',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.getExamResults,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'POST',
        path: '/classes/:classeId/exams',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.createExam,
        schema: Joi.object({
            name: Joi.string().required(),
            duration: Joi.number(),
            startDateTime: Joi.number().required(),
            endDateTime: Joi.number().allow(null),
        }),
        checkAuthorization: accessControlBuilder.assertHasRightPlanForCreation('exam'),
    },
    {
        method: 'POST',
        path: '/exams/:examId/duplicate',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.duplicateExam,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/name',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateExamName,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            name: Joi.string(),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/dateTimeRange',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateExamDateTimeRange,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            startDateTime: Joi.number().required(),
            endDateTime: Joi.number().allow(null),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/edgeText',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateExamEdgeText,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            kind: Joi.string().valid('start', 'end'),
            text: Joi.string().required().allow(''),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/duration',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateExamDuration,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            duration: Joi.number().allow(null),
        }),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.deleteExam,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
    {
        method: 'GET',
        path: '/exams/:examId/shouldDisplayRightAnswers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.fetchShouldDisplayRightAnswersForExamId,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/shouldDisplayRightAnswers',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateShouldDisplayRightAnswersForExamId,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            shouldDisplayRightAnswers: Joi.boolean(),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/classeId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: examController.updateClasseId,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            classeId: Joi.string().required(),
        }),
    },
];

export { examRoutes };
