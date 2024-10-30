import Joi from 'joi';
import { buildResetPasswordRequestController } from '../modules/resetPasswordRequest';
import { routeType } from './types';

const resetPasswordRequestController = buildResetPasswordRequestController();

const resetPasswordRequestRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'POST',
        path: '/reset-password-requests',
        kind: 'public',
        controller: resetPasswordRequestController.createResetPasswordRequest,
        schema: Joi.object({ email: Joi.string().required() }),
    },
    {
        method: 'GET',
        path: '/reset-password-requests/:resetPasswordRequestId/user',
        kind: 'public',
        controller: resetPasswordRequestController.fetchResetPasswordRequestUser,
    },
    {
        method: 'PATCH',
        path: '/reset-password-requests/:resetPasswordRequestId/user/password',
        kind: 'public',
        controller: resetPasswordRequestController.resetPassword,
        schema: Joi.object({ password: Joi.string().required() }),
    },
];

export { resetPasswordRequestRoutes };
