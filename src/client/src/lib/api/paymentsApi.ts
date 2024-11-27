import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const paymentsApi = {
    createCheckoutSession,
    assertIsPaymentSessionCompleted,
};

type packageApiType = { id: string; paperCount: number; price: number };

async function createCheckoutSession(packageId: string): Promise<{ url: string }> {
    const URL = `${BASE_URL}/payment-sessions`;
    return performApiCall(URL, 'POST', { packageId });
}

async function assertIsPaymentSessionCompleted(stripeCheckoutSessionId: string): Promise<{}> {
    const URL = `${BASE_URL}/stripe-checkout-sessions/${stripeCheckoutSessionId}/is-completed`;
    return performApiCall(URL, 'GET');
}

export { paymentsApi };
export type { packageApiType };
