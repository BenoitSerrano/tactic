import Joi from 'joi';
import { buildUserConfigurationController } from '../modules/userConfiguration';
import { routeType } from './types';

const userConfigurationController = buildUserConfigurationController();

const userConfigurationRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'PATCH',
        path: '/user-configurations',
        isAuthenticated: true,
        controller: userConfigurationController.updateDefaultEdgeText,
        schema: Joi.object({
            kind: Joi.string().valid('start', 'end'),
            text: Joi.string().required(),
        }),
    },
];

export { userConfigurationRoutes };
