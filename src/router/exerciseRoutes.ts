import Joi from 'joi';
import { buildExerciseController } from '../modules/exercise';
import { routeType } from './types';
import { accessControlBuilder } from '../lib/accessControlBuilder';
import { questionKinds } from '../modules/question';

const exerciseController = buildExerciseController();

const exerciseRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'PUT',
        path: `/exams/:examId/exercises/:exerciseId`,
        isAuthenticated: true,
        controller: exerciseController.updateExercise,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().required(),
            defaultQuestionKind: Joi.string().valid(...questionKinds),
        }),
    },
    {
        method: 'PATCH',
        path: '/exams/:examId/exercises/order',
        isAuthenticated: true,
        controller: exerciseController.updateExercisesOrder,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
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
        isAuthenticated: true,
        controller: exerciseController.createExercise,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
        schema: Joi.object({
            name: Joi.string().required(),
            instruction: Joi.string().required().allow(''),
            defaultPoints: Joi.number().required(),
            defaultQuestionKind: Joi.string().valid(...questionKinds),
        }),
    },
    {
        method: 'DELETE',
        path: `/exams/:examId/exercises/:exerciseId`,
        isAuthenticated: true,
        controller: exerciseController.deleteExercise,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'exam', key: 'examId' },
        ]),
    },
];

export { exerciseRoutes };
