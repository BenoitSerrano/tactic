import jwt from 'jsonwebtoken';
import { config } from '../config';

const ONE_WEEK = 60 * 60 * 24 * 7;

function sign(payload: Object) {
    const token = jwt.sign(payload, config.JWT_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: ONE_WEEK,
    });

    return token;
}

function verify(token: string) {
    return jwt.verify(token, config.JWT_TOKEN_SECRET, { algorithms: ['HS256'] });
}

const signer = { sign, verify };

export { signer };
