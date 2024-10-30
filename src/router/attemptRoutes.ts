import Joi from 'joi';
import { buildAttemptController } from '../modules/attempt';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const attemptController = buildAttemptController();

const attemptRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-attempts',
        kind: 'public',
        controller: attemptController.getAllAttempts,
    },
    {
        method: 'GET',
        path: '/exams/:examId/attempts/count-by-correction-status',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.fetchAttemptsCountByCorrectionStatus,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'GET',
        path: '/exams/:examId/students/:studentId/attempts',
        kind: 'public',
        controller: attemptController.searchAttempt,
    },
    {
        method: 'GET',
        path: '/attempts/:attemptId/with-answers',
        kind: 'public',
        controller: attemptController.fetchAttemptWithAnswers,
    },

    {
        method: 'GET',
        path: '/attempts/:attemptId/without-answers',
        kind: 'public',
        controller: attemptController.fetchAttemptWithoutAnswers,
    },
    {
        method: 'PUT',
        path: '/attempts/:attemptId',
        kind: 'public',
        controller: attemptController.updateAttempt,
        schema: Joi.object<Record<string, string>>({}).pattern(
            Joi.string().allow(''),
            Joi.string().allow(''),
        ),
    },
    {
        method: 'PATCH',
        path: '/attempts/:attemptId/cheating-summary',
        kind: 'public',
        controller: attemptController.updateAttemptCheatingSummary,
        schema: Joi.object({
            roundTrips: Joi.number().required(),
            timeSpentOutside: Joi.number().required(),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/attempts/:attemptId/questions/:questionId/manual-mark',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.updateManualMark,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            manualMark: Joi.number().required(),
        }),
    },
    {
        method: 'PATCH',
        path: '/attempts/:attemptId/endedAt',
        kind: 'public',
        controller: attemptController.updateAttemptEndedAt,
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/attempts/:attemptId/correctedAt',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.updateAttemptCorrectedAt,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'POST',
        path: '/exams/:examId/students/:studentId/attempts',
        kind: 'public',
        controller: attemptController.createAttempt,
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId/endedAt',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.deleteAttemptEndedAt,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.deleteAttempt,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
    {
        method: 'DELETE',
        path: '/exams/:examId/attempts/:attemptId/correctedAt',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: attemptController.deleteAttemptCorrectedAt,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
    },
];

export { attemptRoutes };
