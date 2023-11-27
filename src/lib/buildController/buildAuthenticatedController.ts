import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import { User } from '../../modules/user';
import { dataSource } from '../../dataSource';
import { extractUserIdFromHeader } from './extractUserIdFromHeader';

export { buildAuthenticatedController };

function buildAuthenticatedController<paramsT extends Record<string, string>, bodyT>(
    controller: (params: { urlParams: paramsT; body: bodyT }, user: User) => any | Promise<any>,
    options?: {
        schema?: Joi.Schema;
        checkAuthorization?: (params: paramsT, user: User) => void | Promise<void>;
    },
) {
    return async (req: Request, res: Response) => {
        console.log(`${req.method} ${req.originalUrl}`);

        let user: User;
        const userRepository = dataSource.getRepository(User);
        try {
            const userId = extractUserIdFromHeader(req);
            user = await userRepository.findOneByOrFail({ id: userId });
        } catch (error) {
            console.error(error);
            res.sendStatus(httpStatus.UNAUTHORIZED);
            return;
        }

        if (options?.checkAuthorization) {
            try {
                await options.checkAuthorization(req.params as paramsT, user);
            } catch (error) {
                console.error(error);
                res.sendStatus(httpStatus.FORBIDDEN);
                return;
            }
        }

        if (options?.schema) {
            const { error } = options.schema.validate(req.body);
            if (error) {
                console.error(error);
                res.status(httpStatus.BAD_REQUEST).send(error.message);
                return;
            }
        }

        try {
            const result = await controller(
                {
                    urlParams: req.params as paramsT,
                    body: req.body,
                },
                user,
            );
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        } catch (error) {
            console.error(error);
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    };
}
