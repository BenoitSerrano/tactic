import Joi from 'joi';
import { buildResetPasswordRequestController } from '../modules/resetPasswordRequest';
import { routeType } from './types';

const resetPasswordRequestController = buildResetPasswordRequestController();

const resetPasswordRequestRoutes: Array<routeType<any, any>> = [
    {
        method: 'POST',
        path: '/reset-password-requests',
        isAuthenticated: false,
        controller: resetPasswordRequestController.createResetPasswordRequest,
        schema: Joi.object({ email: Joi.string().required() }),
    },
    {
        method: 'GET',
        path: '/reset-password-requests/:resetPasswordRequestId/user',
        isAuthenticated: false,
        controller: resetPasswordRequestController.fetchResetPasswordRequestUser,
    },
    {
        method: 'PATCH',
        path: '/reset-password-requests/:resetPasswordRequestId/user/password',
        isAuthenticated: false,
        controller: resetPasswordRequestController.resetPassword,
        schema: Joi.object({ password: Joi.string().required() }),
    },
];

export { resetPasswordRequestRoutes };
