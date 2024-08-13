import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import { logger } from '../../../lib/logger';

export { buildAnonymousController };

function buildAnonymousController<
    paramsT extends Record<string, string>,
    queryT extends Record<string, string>,
    bodyT,
>(
    controller: (params: { query: queryT; urlParams: paramsT; body: bodyT }) => any | Promise<any>,
    options?: {
        schema?: Joi.Schema;
    },
) {
    return async (req: Request, res: Response) => {
        logger.info(`${req.method} ${req.originalUrl}`);

        if (options?.schema) {
            const { error } = options.schema.validate(req.body);
            if (error) {
                logger.error(error);
                res.status(httpStatus.BAD_REQUEST).send(error.message);
                return;
            }
        }

        try {
            const result = await controller({
                query: req.query as queryT,
                urlParams: req.params as paramsT,
                body: req.body,
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        } catch (error) {
            logger.error(error);
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        }
    };
}
