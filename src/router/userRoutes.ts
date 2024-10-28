import { buildUserController } from '../modules/user';
import { routeType } from './types';

const userController = buildUserController();

const userRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'POST',
        path: '/users',
        isAuthenticated: false,
        controller: userController.createUser,
    },
    {
        method: 'POST',
        path: '/login',
        isAuthenticated: false,
        controller: userController.login,
    },
    {
        method: 'POST',
        path: '/login',
        isAuthenticated: false,
        controller: userController.login,
    },
    {
        method: 'GET',
        path: '/users-summary',
        isAuthenticated: true,
        controller: userController.getUsersSummary,
    },
];

export { userRoutes };
