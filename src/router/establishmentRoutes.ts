import Joi from 'joi';
import { buildEstablishmentController } from '../modules/establishment';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const establishmentController = buildEstablishmentController();

const establishmentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/establishments',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: establishmentController.getEstablishments,
    },
    {
        method: 'POST',
        path: '/establishments',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: establishmentController.createEstablishment,
        schema: Joi.object({ name: Joi.string().required() }),
    },
    {
        method: 'PUT',
        path: '/establishments/:establishmentId',
        authorizedRoles: ['teacher'],
        kind: 'authenticated',
        controller: establishmentController.updateEstablishment,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            {
                entity: 'establishment',
                key: 'establishmentId',
            },
        ]),
        schema: Joi.object({ name: Joi.string().required() }),
    },
];

export { establishmentRoutes };
