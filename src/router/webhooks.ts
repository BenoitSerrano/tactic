import { stripeWebhook } from './webhooks/stripeWebhook';
import { webhookType } from './webhooks/types';

const webhooks: Array<webhookType> = [stripeWebhook];

export { webhooks };
