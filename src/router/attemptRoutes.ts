import Joi from 'joi';
import { buildAttemptController } from '../modules/attempt';
import { routeType } from './types';
import { accessControlBuilder } from '../lib/accessControlBuilder';

const attemptController = buildAttemptController();

const attemptRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-attempts',
        isAuthenticated: false,
        controller: attemptController.getAllAttempts,
    },
    {
        method: 'GET',
        path: '/exams/:examId/attempts/count-by-correction-status',
        isAuthenticated: true,
        controller: attemptController.fetchAttemptsCountByCorrectionStatus,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'GET',
        path: '/exams/:examId/students/:studentId/attempts',
        isAuthenticated: false,
        controller: attemptController.searchAttempt,
    },
    {
        method: 'GET',
        path: '/attempts/:attemptId/with-answers',
        isAuthenticated: false,
        controller: attemptController.fetchAttemptWithAnswers,
    },

    {
        method: 'GET',
        path: '/attempts/:attemptId/without-answers',
        isAuthenticated: false,
        controller: attemptController.fetchAttemptWithoutAnswers,
    },
    {
        method: 'PUT',
        path: '/attempts/:attemptId',
        isAuthenticated: false,
        controller: attemptController.updateAttempt,
        schema: Joi.object<Record<string, string>>({}).pattern(
            Joi.string().allow(''),
            Joi.string().allow(''),
        ),
    },
    {
        method: 'PATCH',
        path: '/attempts/:attemptId/cheating-summary',
        isAuthenticated: false,
        controller: attemptController.updateAttemptCheatingSummary,
        schema: Joi.object({
            roundTrips: Joi.number().required(),
            timeSpentOutside: Joi.number().required(),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/attempts/:attemptId/questions/:questionId/grade',
        isAuthenticated: true,
        controller: attemptController.updateGrade,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            grade: Joi.string()
                .required()
                .regex(/^[A-E]$/),
        }),
    },
    {
        method: 'PATCH',
        path: '/attempts/:attemptId/endedAt',
        isAuthenticated: false,
        controller: attemptController.updateAttemptEndedAt,
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/attempts/:attemptId/correctedAt',
        isAuthenticated: true,
        controller: attemptController.updateAttemptCorrectedAt,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'POST',
        path: '/exams/:examId/students/:studentId/attempts',
        isAuthenticated: false,
        controller: attemptController.createAttempt,
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId/endedAt',
        isAuthenticated: true,
        controller: attemptController.deleteAttemptEndedAt,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId',
        isAuthenticated: true,
        controller: attemptController.deleteAttempt,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId/correctedAt',
        isAuthenticated: true,
        controller: attemptController.deleteAttemptCorrectedAt,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
];

export { attemptRoutes };
