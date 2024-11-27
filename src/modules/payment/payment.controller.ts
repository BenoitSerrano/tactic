import { Package } from '../package';
import { User } from '../user';
import { buildPaymentService } from './payment.service';
import { PaymentSession } from './PaymentSession.entity';

function buildPaymentController() {
    const paymentService = buildPaymentService();

    return { createCheckoutSession, assertIsPaymentSessionCompleted };

    function createCheckoutSession(
        params: {
            body: { packageId: Package['id'] };
        },
        user: User,
    ) {
        return paymentService.createCheckoutSession({
            user,
            packageId: params.body.packageId,
        });
    }

    function assertIsPaymentSessionCompleted(params: {
        urlParams: { stripeCheckoutSessionId: PaymentSession['stripeCheckoutSessionId'] };
    }) {
        return paymentService.assertIsPaymentSessionCompleted(
            params.urlParams.stripeCheckoutSessionId,
        );
    }
}

export { buildPaymentController };
