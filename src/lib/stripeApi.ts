import Stripe from 'stripe';
import { config } from '../config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const stripeApi = {
    getAllProducts,
    getAllPrices,
};

function getAllProducts() {
    return stripe.products.list({ active: true });
}

function getAllPrices() {
    return stripe.prices.list({ active: true });
}
export { stripeApi };
