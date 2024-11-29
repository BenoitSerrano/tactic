import Stripe from 'stripe';
import { config } from '../../config';
import { buildUserService, User } from '../user';
import { dataSource } from '../../dataSource';
import { PaymentSession } from './PaymentSession.entity';
import { Package } from '../package';
import { buildPackageService } from '../package';

function buildPaymentService() {
    const stripe = new Stripe(config.STRIPE_SECRET_KEY);
    const packageService = buildPackageService();
    const userService = buildUserService();
    const paymentSessionRepository = dataSource.getRepository(PaymentSession);
    return {
        extractInfoFromWebhookPayload,
        fullfillCheckout,
        createCheckoutSession,
        expirePaymentSession,
        assertIsPaymentSessionCompleted,
    };

    async function extractInfoFromWebhookPayload(
        sig: string,
        payload: string,
    ): Promise<{ eventKind: 'completed' | 'expired'; stripeCheckoutSessionId: string }> {
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                payload,
                sig,
                config.STRIPE_WEBHOOK_ENDPOINT_SECRET,
            );
        } catch (err) {
            console.error(err);
            throw new Error(`⚠️  Webhook signature verification failed.`);
        }
        const eventType = event.type;

        switch (eventType) {
            case 'checkout.session.completed':
                return { eventKind: 'completed', stripeCheckoutSessionId: event.data.object.id };
            case 'checkout.session.expired':
                return { eventKind: 'expired', stripeCheckoutSessionId: event.data.object.id };
            default:
                throw new Error(`Could not handle event.type "${eventType}"`);
        }
    }

    async function fullfillCheckout(stripeCheckoutSessionId: string): Promise<number> {
        const paymentSession = await paymentSessionRepository.findOneOrFail({
            where: {
                stripeCheckoutSessionId,
            },
            relations: { user: true, package: true },
        });

        switch (paymentSession.status) {
            case 'pending':
                await userService.addPapers(paymentSession.user, paymentSession.package.paperCount);
                await userService.updateAttemptsTreatedAt(paymentSession.user.id);
                await paymentSessionRepository.update(
                    { id: paymentSession.id },
                    { status: 'completed' },
                );
                return 1;
            case 'completed':
                return 1;
            case 'expired':
                throw new Error(
                    `Trying to fulfill a checkout for an expired stripe checkout session "${stripeCheckoutSessionId}"`,
                );
        }
    }

    async function createCheckoutSession(params: { user: User; packageId: Package['id'] }) {
        const pack = await packageService.getPackage(params.packageId);

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer_email: params.user.email,
            line_items: [
                {
                    price: pack.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',

            success_url: `${config.CLIENT_URL}/teacher/payment/stripe-checkout-sessions/{CHECKOUT_SESSION_ID}/success`,
            cancel_url: `${config.CLIENT_URL}/teacher/payment/failure`,
        });
        const stripeCheckoutSessionId = stripeCheckoutSession.id;
        await paymentSessionRepository.insert({
            stripeCheckoutSessionId,
            user: params.user,
            package: pack,
            status: 'pending',
        });
        return { url: stripeCheckoutSession.url };
    }

    async function expirePaymentSession(
        stripeCheckoutSessionId: PaymentSession['stripeCheckoutSessionId'],
    ) {
        const result = await paymentSessionRepository.update(
            { stripeCheckoutSessionId },
            { status: 'expired' },
        );
        if (result.affected !== 1) {
            throw new Error(
                `Could not find paymentSession with stripeCheckoutSession "${stripeCheckoutSessionId}"`,
            );
        }
    }

    async function assertIsPaymentSessionCompleted(
        stripeCheckoutSessionId: PaymentSession['stripeCheckoutSessionId'],
    ) {
        const paymentSession = await paymentSessionRepository.findOneOrFail({
            where: { stripeCheckoutSessionId },
            select: { id: true, status: true },
        });
        if (paymentSession.status !== 'completed') {
            throw new Error(`Payment session status not completed: "${paymentSession.status}"`);
        }
        return {};
    }
}

export { buildPaymentService };
