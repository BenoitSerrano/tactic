import Joi from 'joi';
import { buildGroupController } from '../modules/group';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const groupController = buildGroupController();

const groupRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-groups',
        isAuthenticated: false,
        controller: groupController.getAllGroups,
    },
    {
        method: 'GET',
        path: '/groups',
        isAuthenticated: true,
        controller: groupController.fetchGroups,
    },
    {
        method: 'POST',
        path: '/groups',
        isAuthenticated: true,
        controller: groupController.createGroup,
        schema: Joi.object({ name: Joi.string().required() }),
    },
    {
        method: 'DELETE',
        path: '/groups/:groupId',
        isAuthenticated: true,
        controller: groupController.deleteGroup,
        checkAuthorization: accessControlBuilder.hasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    },
];

export { groupRoutes };
