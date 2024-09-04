import { webhookType } from './types';
import { buildPaymentService } from '../../modules/payment';
import { logger } from '../../lib/logger';

const stripeWebhook: webhookType = {
    method: 'POST',
    path: '/stripe-webhook',
    controller: async (req, res) => {
        const paymentService = buildPaymentService();
        const sig = req.headers['stripe-signature'] as string;
        const payload = req.body;
        console.log('WEBHOOK');
        console.log(sig);
        console.log(payload);

        let sessionId: string | undefined;

        try {
            paymentService.extractSessionIdFromWebhookPayload(sig, payload);
        } catch (err: any) {
            logger.error(err);
            res.status(400).send();
            return;
        }
        if (sessionId) {
            await paymentService.fullfillCheckout(sessionId);
        }

        res.status(200).end();
    },
};

export { stripeWebhook };
