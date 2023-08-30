import jwt from 'jsonwebtoken';
import { config } from '../config';

const ONE_MONTH = 60 * 60 * 24 * 30;

function sign(payload: Object) {
    const token = jwt.sign(payload, config.JWT_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: ONE_MONTH,
    });

    return token;
}

function verify(token: string) {
    return jwt.verify(token, config.JWT_TOKEN_SECRET, { algorithms: ['HS256'] });
}

const signer = { sign, verify };

export { signer };
