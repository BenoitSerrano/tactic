import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import { extractUserIdFromHeader } from './extractUserIdFromHeader';
import { logger } from '../../../lib/logger';
import { User } from '../../../modules/user';
import { dataSource } from '../../../dataSource';
import { userRoleType } from '../../../modules/user/constants';

export { buildAuthenticatedController };

function buildAuthenticatedController<
    paramsT extends Record<string, string>,
    queryT extends Record<string, string>,
    bodyT,
>(
    controller: (
        params: { query: queryT; urlParams: paramsT; body: bodyT },
        user: User,
    ) => any | Promise<any>,
    options?: {
        authorizedRoles?: userRoleType[];
        schema?: Joi.Schema;
        checkAuthorization?: (params: paramsT, user: User) => void | Promise<void>;
    },
) {
    return async (req: Request, res: Response) => {
        logger.info(`${req.method} ${req.originalUrl}`);

        let user: User;
        const userRepository = dataSource.getRepository(User);
        try {
            const userId = extractUserIdFromHeader(req);
            user = await userRepository.findOneOrFail({
                where: { id: userId },
                relations: ['userConfiguration'],
            });
        } catch (error) {
            logger.error(error);
            res.sendStatus(httpStatus.UNAUTHORIZED);
            return;
        }

        if (options?.authorizedRoles) {
            if (
                options.authorizedRoles.every(
                    (authorizedRole) => !user.roles.includes(authorizedRole),
                )
            ) {
                const message = `Your roles (${user.roles.join(
                    ', ',
                )}) are not allowed to call this route (${options.authorizedRoles.join(', ')})`;
                logger.error(message);
                res.status(httpStatus.FORBIDDEN).send(message);
                return;
            }
        }

        if (options?.checkAuthorization) {
            try {
                await options.checkAuthorization(req.params as paramsT, user);
            } catch (error: any) {
                logger.error(error.message);
                res.status(httpStatus.FORBIDDEN).send(error.message);
                return;
            }
        }

        if (options?.schema) {
            const { error } = options.schema.validate(req.body);
            if (error) {
                logger.error(error);
                res.status(httpStatus.BAD_REQUEST).send(error.message);
                return;
            }
        }

        try {
            const result = await controller(
                {
                    query: req.query as queryT,
                    urlParams: req.params as paramsT,
                    body: req.body,
                },
                user,
            );
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        } catch (error) {
            logger.error(error);
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    };
}
