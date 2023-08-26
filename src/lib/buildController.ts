import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import { User } from '../modules/user';
import { signer } from './signer';
import { dataSource } from '../dataSource';

export { buildController };

function buildController<paramsT extends Record<string, string>, bodyT>(
    controller: ({ urlParams, body }: { urlParams: paramsT; body: bodyT }) => any | Promise<any>,
    options?: {
        schema?: Joi.Schema;
        checkAuthorization?: (params: paramsT, user: User) => void | Promise<void>;
    },
) {
    return async (req: Request, res: Response) => {
        if (options?.checkAuthorization) {
            const userRepository = dataSource.getRepository(User);
            try {
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
                const user = await userRepository.findOneByOrFail({ id: userId });

                await options.checkAuthorization(req.params as paramsT, user);
            } catch (error) {
                console.error(error);
                res.sendStatus(httpStatus.UNAUTHORIZED);
                return;
            }
        }

        if (options?.schema) {
            const { error } = options.schema.validate(req.body);
            console.error(error);
            if (error) {
                res.status(httpStatus.BAD_REQUEST).send(error.message);
                return;
            }
        }

        try {
            const result = await controller({ urlParams: req.params as paramsT, body: req.body });
            res.send(result);
        } catch (error) {
            console.error(error);
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    };
}
