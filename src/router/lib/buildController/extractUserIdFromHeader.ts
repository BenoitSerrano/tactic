import { Request } from 'express';
import { signer } from '../../../lib/signer';

function extractUserIdFromHeader(req: Request) {
    const authorization = req.header('Authorization');
    if (!authorization) {
        throw new Error(`No Authorization header provided`);
    }
    const [_, token] = authorization.toString().split(' ');
    if (!token) {
        throw new Error(`No Bearer token provided`);
    }
    const payload = signer.verify(token) as Record<string, string>;
    const userId = payload.userId;
    if (!userId) {
        throw new Error(`No userId present in jwt payload`);
    }
    return userId;
}

export { extractUserIdFromHeader };
