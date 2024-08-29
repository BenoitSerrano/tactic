import Stripe from 'stripe';
import { config } from '../../config';

function buildPaymentService() {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    return {
        createCheckoutSession,
    };

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
}

export { buildPaymentService };
