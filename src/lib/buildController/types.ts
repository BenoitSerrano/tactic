import { User } from '../../modules/user';

type anonymousControllerType<paramsT, bodyT> = (params: {
    urlParams: paramsT;
    body: bodyT;
}) => any | Promise<any>;

type authenticatedControllerType<paramsT, bodyT> = (
    params: {
        urlParams: paramsT;
        body: bodyT;
    },
    user: User,
) => any | Promise<any>;

export type { anonymousControllerType, authenticatedControllerType };
