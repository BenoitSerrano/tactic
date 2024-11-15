import { buildUserController } from '../modules/user';
import { routeType } from './types';

const userController = buildUserController();

const userRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'POST',
        path: '/users',
        kind: 'public',
        controller: userController.createUser,
    },
    {
        method: 'POST',
        path: '/login',
        kind: 'public',
        controller: userController.login,
    },
    {
        method: 'GET',
        path: '/users-summary',
        kind: 'authenticated',
        authorizedRoles: ['admin'],
        controller: userController.getUsersSummary,
    },
    { method: 'GET', path: '/all-users', kind: 'public', controller: userController.getAllUsers },
];

export { userRoutes };
