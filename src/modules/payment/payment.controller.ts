import { Package } from '../package';
import { User } from '../user';
import { buildPaymentService } from './payment.service';

function buildPaymentController() {
    const paymentService = buildPaymentService();

    return { createCheckoutSession };

    function createCheckoutSession(
        params: {
            urlParams: { packageId: Package['id'] };
        },
        user: User,
    ) {
        return paymentService.createCheckoutSession({
            user,
            packageId: params.urlParams.packageId,
        });
    }
}

export { buildPaymentController };
