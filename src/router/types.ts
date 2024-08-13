import Joi from 'joi';
import { User } from '../modules/user';
import { anonymousControllerType, authenticatedControllerType } from './lib/buildController/types';

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
