import { User } from '../../../modules/user';

type anonymousControllerType<paramsT, queryT, bodyT> = (params: {
    urlParams: paramsT;
    query: queryT;
    body: bodyT;
}) => any | Promise<any>;

type authenticatedControllerType<paramsT, queryT, bodyT> = (
    params: {
        query: queryT;
        urlParams: paramsT;
        body: bodyT;
    },
    user: User,
) => any | Promise<any>;

export type { anonymousControllerType, authenticatedControllerType };
