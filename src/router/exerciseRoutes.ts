import Joi from 'joi';
import { buildExerciseController } from '../modules/exercise';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';
import { questionKinds } from '../modules/question';

const exerciseController = buildExerciseController();

const exerciseRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'PUT',
        path: `/exams/:examId/exercises/:exerciseId`,
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: exerciseController.updateExercise,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().allow(null),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/exercises/order',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: exerciseController.updateExercisesOrder,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'exam',
                key: 'examId',
            },
        ]),
        schema: Joi.object({
            orderedIds: Joi.array().items(Joi.number().required()),
        }),
    },
    {
        method: 'POST',
        path: `/exams/:examId/exercises`,
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: exerciseController.createExercise,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().allow(null),
            defaultQuestionKind: Joi.string().valid(...questionKinds),
        }),
    },
    {
        method: 'DELETE',
        path: `/exams/:examId/exercises/:exerciseId`,
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: exerciseController.deleteExercise,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
];

export { exerciseRoutes };
