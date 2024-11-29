import { buildPaymentService } from '../../modules/payment';
import { logger } from '../../lib/logger';
import { webhookType } from './types';

const stripeWebhook: webhookType = {
    method: 'POST',
    path: '/stripe-webhook',
    controller: async (req, res) => {
        const paymentService = buildPaymentService();
        const sig = req.headers['stripe-signature'] as string;
        const payload = req.body;

        try {
            const { eventKind, stripeCheckoutSessionId, stripeCustomerId } =
                await paymentService.extractInfoFromWebhookPayload(sig, payload);
            switch (eventKind) {
                case 'completed':
                    const errorCode = await paymentService.fullfillCheckout(
                        stripeCheckoutSessionId,
                        stripeCustomerId,
                    );
                    if (errorCode !== 1) {
                        throw new Error(
                            `Could not handle checkout session id: "${stripeCheckoutSessionId}"`,
                        );
                    }
                    break;
                case 'expired':
                    await paymentService.expirePaymentSession(stripeCheckoutSessionId);
            }
        } catch (err: any) {
            logger.error(err);
            res.status(400).send();
            return;
        }

        res.status(200).end();
    },
};

export { stripeWebhook };
