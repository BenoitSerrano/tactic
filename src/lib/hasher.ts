import crypto from 'crypto';
import { config } from '../config';

const hasher = { hash };

function hash(value: string) {
    const hashedValue = crypto
        .createHmac('sha256', config.JWT_TOKEN_SECRET)
        .update(value)
        .digest('hex');
    return hashedValue;
}

export { hasher };
