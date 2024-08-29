import Stripe from 'stripe';
import { config } from '../../config';

function buildPaymentService() {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    return {
        createCheckoutSession,
        fullfillCheckout,
        extractSessionIdFromWebhookPayload,
    };

    function extractSessionIdFromWebhookPayload(sig: string, payload: string): string | undefined {
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                payload,
                sig,
                config.STRIPE_WEBHOOK_ENDPOINT_SECRET,
            );
        } catch (err: any) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (
            event.type === 'checkout.session.completed' ||
            event.type === 'checkout.session.async_payment_succeeded'
        ) {
            return event.data.object.id;
        }
    }

    async function createCheckoutSession() {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1Pt9arChPUKuvtVnSI1CjE2K',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${config.CLIENT_URL}/teacher/payment/end?success=true`,
            cancel_url: `${config.CLIENT_URL}/teacher/payment/end?canceled=true`,
        });
        return { url: session.url };
    }

    async function fullfillCheckout(sessionId: string) {
        console.log('Fulfilling Checkout Session ' + sessionId);

        // TODO: Make this function safe to run multiple times,
        // even concurrently, with the same session ID

        // TODO: Make sure fulfillment hasn't already been
        // peformed for this Checkout Session

        // Retrieve the Checkout Session from the API with line_items expanded
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });
        console.log(checkoutSession);

        // Check the Checkout Session's payment_status property
        // to determine if fulfillment should be peformed
        if (checkoutSession.payment_status !== 'unpaid') {
            // TODO: Perform fulfillment of the line items
            // TODO: Record/save fulfillment status for this
            // Checkout Session
        }

        return { truc: 'YOUPI' };
    }
}

export { buildPaymentService };
