import crypto from 'crypto';
import { config } from '../config';

const hasher = { hash, verify };

function hash(value: string) {
    const hashedValue = crypto.createHmac('sha256', config.HASH_SECRET).update(value).digest('hex');
    return hashedValue;
}

function verify(value: string, hashedValue: string) {
    return hash(value) === hashedValue;
}

export { hasher };
