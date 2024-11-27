import Joi from 'joi';
import { User } from '../modules/user';
import { anonymousControllerType, authenticatedControllerType } from './lib/buildController/types';
import { userRoleType } from '../modules/user/constants';
import { Request, Response } from 'express';

type methodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type routeType<paramsT, queryT, bodyT> =
    | {
          kind: 'authenticated';
          method: methodType;
          path: string;
          authorizedRoles: userRoleType[];
          controller: authenticatedControllerType<paramsT, queryT, bodyT>;
          schema?: Joi.Schema;
          checkAuthorization?: (params: paramsT, user: User) => void | Promise<void>;
      }
    | {
          kind: 'public';
          method: methodType;
          path: string;
          controller: anonymousControllerType<paramsT, queryT, bodyT>;
          schema?: Joi.Schema;
      };

type controllerType = (req: Request, res: Response) => void | Promise<void>;

export type { routeType, methodType, controllerType };
