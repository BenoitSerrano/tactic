import Joi from 'joi';
import { buildEstablishmentController } from '../modules/establishment';
import { routeType } from './types';

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
];

export { establishmentRoutes };
