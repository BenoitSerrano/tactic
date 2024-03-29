import Joi from 'joi';
import { anonymousControllerType, authenticatedControllerType } from '../lib/buildController/types';
import { User } from '../modules/user';

type methodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type routeType<paramsT, queryT, bodyT> =
    | {
          method: methodType;
          path: string;
          isAuthenticated: true;
          controller: authenticatedControllerType<paramsT, queryT, bodyT>;
          schema?: Joi.Schema;
          checkAuthorization?: (params: paramsT, user: User) => void | Promise<void>;
      }
    | {
          method: methodType;
          path: string;
          isAuthenticated: false;
          controller: anonymousControllerType<paramsT, queryT, bodyT>;
          schema?: Joi.Schema;
      };

export type { routeType };
