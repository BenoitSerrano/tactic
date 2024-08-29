import { buildPaymentService } from './payment.service';

export { buildPaymentController };

function buildPaymentController() {
    const paymentService = buildPaymentService();
    const paymentController = {
        createPayment,
    };

    return paymentController;

    async function createPayment() {
        return paymentService.createCheckoutSession();
    }
}
