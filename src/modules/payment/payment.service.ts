import Stripe from 'stripe';
import { config } from '../../config';
import { logger } from '../../lib/logger';

function buildPaymentService() {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    return {
        createCheckoutSession,
        fullfillCheckout,
        extractSessionIdFromWebhookPayload,
    };

    function extractSessionIdFromWebhookPayload(sig: string, payload: string) {
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                payload,
                sig,
                config.STRIPE_WEBHOOK_ENDPOINT_SECRET,
            );
        } catch (err) {
            logger.error(err);
            throw new Error(`⚠️  Webhook signature verification failed.`);
        }
        // Extract the object from the event.
        const data = event.data;
        const eventType = event.type;

        switch (eventType) {
            case 'checkout.session.completed':
                // Payment is successful and the subscription is created.
                // You should provision the subscription and save the customer ID to your database.
                break;
            case 'invoice.paid':
                // Continue to provision the subscription as payments continue to be made.
                // Store the status in your database and check when a user accesses your service.
                // This approach helps you avoid hitting rate limits.
                break;
            case 'invoice.payment_failed':
                // The payment failed or the customer does not have a valid payment method.
                // The subscription becomes past_due. Notify your customer and send them to the
                // customer portal to update their payment information.
                break;
            default:
            // Unhandled event type
        }
    }

    async function createCheckoutSession() {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1PvNU8ChPUKuvtVn8GoGM8Ua',
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${config.CLIENT_URL}/teacher/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.CLIENT_URL}/teacher/payment/canceled`,
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
