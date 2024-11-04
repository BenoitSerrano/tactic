import Joi from 'joi';
import { buildGroupController } from '../modules/group';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const groupController = buildGroupController();

const groupRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-groups',
        kind: 'public',
        controller: groupController.getAllGroups,
    },
    {
        method: 'GET',
        path: '/groups',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: groupController.fetchGroups,
    },
    {
        method: 'POST',
        path: '/groups',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: groupController.createGroup,
        schema: Joi.object({ name: Joi.string().required() }),
    },
    {
        method: 'DELETE',
        path: '/groups/:groupId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: groupController.deleteGroup,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'groupId' },
        ]),
    },
];

export { groupRoutes };
