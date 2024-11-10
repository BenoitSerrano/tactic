import Joi from 'joi';
import { buildClasseController } from '../modules/classe';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const classeController = buildClasseController();

const classeRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-classes',
        kind: 'public',
        controller: classeController.getAllClasses,
    },
    {
        method: 'GET',
        path: '/establishment/:establishmentId/classes',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: classeController.getClassesByEstablishment,
    },
    {
        method: 'POST',
        path: '/classes',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: classeController.createClasse,
        schema: Joi.object({ name: Joi.string().required() }),
    },
    {
        method: 'PATCH',
        path: '/classes/:classeId/establishmentId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
        ]),
        controller: classeController.updateEstablishmentId,
        schema: Joi.object({ establishmentId: Joi.string().required() }),
    },
    {
        method: 'PATCH',
        path: '/classes/:classeId/name',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: classeController.updateClasseName,
        schema: Joi.object({ name: Joi.string().required() }),
    },
    {
        method: 'DELETE',
        path: '/classes/:classeId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: classeController.deleteClasse,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
        ]),
    },
];

export { classeRoutes };
