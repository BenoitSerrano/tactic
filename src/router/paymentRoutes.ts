import { buildPaymentController } from '../modules/payment';

import { routeType } from './types';

const paymentController = buildPaymentController();

const paymentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'POST',
        path: '/checkout/sessions',
        isAuthenticated: true,
        controller: paymentController.createPayment,
    },
];

export { paymentRoutes };
