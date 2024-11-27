import { routeType } from './types';
import { buildPaymentController } from '../modules/payment';
import Joi from 'joi';

const paymentController = buildPaymentController();

const paymentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'POST',
        path: '/payment-sessions',
        kind: 'authenticated',
        controller: paymentController.createCheckoutSession,
        authorizedRoles: ['teacher'],
        schema: Joi.object({ packageId: Joi.string().required() }),
    },
];

export { paymentRoutes };
