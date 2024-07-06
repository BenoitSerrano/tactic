import jwt from 'jsonwebtoken';
import { config } from '../config';

const SIX_MONTHS = 60 * 60 * 24 * 30 * 6;
const ALGORITHM = 'HS256' as const;

function sign(payload: Object) {
    const token = jwt.sign(payload, config.JWT_TOKEN_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: SIX_MONTHS,
    });

    return token;
}

function verify(token: string) {
    return jwt.verify(token, config.JWT_TOKEN_SECRET, { algorithms: [ALGORITHM] });
}

const signer = { sign, verify };

export { signer };
