import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const paymentsApi = {
    createCheckoutSession,
};

type packageApiType = { id: string; paperCount: number; price: number };

async function createCheckoutSession(packageId: string): Promise<{ url: string }> {
    const URL = `${BASE_URL}/payment-sessions`;
    return performApiCall(URL, 'POST', { packageId });
}

export { paymentsApi };
export type { packageApiType };
