import { webhookType } from './types';
import { buildPaymentService } from '../../modules/payment';

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
            sessionId = paymentService.extractSessionIdFromWebhookPayload(sig, payload);
        } catch (err: any) {
            res.status(400).send(err);
            return;
        }
        if (sessionId) {
            await paymentService.fullfillCheckout(sessionId);
        }

        res.status(200).end();
    },
};

export { stripeWebhook };
