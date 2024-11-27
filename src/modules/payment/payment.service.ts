import Stripe from 'stripe';
import { config } from '../../config';
import { User } from '../user';
import { dataSource } from '../../dataSource';
import { PaymentSession } from './PaymentSession.entity';
import { Package } from '../package';
import { buildPackageService } from '../package';

function buildPaymentService() {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    const packageService = buildPackageService();
    const paymentSessionRepository = dataSource.getRepository(PaymentSession);
    return {
        createCheckoutSession,
    };

    async function createCheckoutSession(params: { user: User; packageId: Package['id'] }) {
        const pack = await packageService.getPackage(params.packageId);
        const session = await stripe.checkout.sessions.create({
            customer_email: params.user.email,
            line_items: [
                {
                    price: pack.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${config.CLIENT_URL}/teacher/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.CLIENT_URL}/teacher/payment/failure`,
        });
        const sessionId = session.id;
        await paymentSessionRepository.insert({
            stripeCheckoutSessionId: sessionId,
            user: params.user,
        });
        return { url: session.url };
    }
}

export { buildPaymentService };
