import { ROUTE_KEYS } from '../routes/routeKeys';
import { ROUTE_PATHS } from '../routes/routePaths';

const pathHandler = {
    extractCurrentAttemptId,
    getRoutePath,
};

function getRoutePath<paramsT extends Record<string, string>>(
    routeKey: (typeof ROUTE_KEYS)[number],
    parameters?: paramsT,
    queryParameters?: Record<string, string>,
) {
    let path = ROUTE_PATHS[routeKey].path;
    if (parameters) {
        Object.keys(parameters).forEach((key) => {
            path = path.replace(new RegExp(':' + key), parameters[key]);
        });
    }
    if (queryParameters) {
        path = path + '?';
        const queryParameterKeys = Object.keys(queryParameters);
        for (let i = 0; i < queryParameterKeys.length; i++) {
            const key = queryParameterKeys[i];
            const value = queryParameters[key];
            if (i > 0) {
                path += '&';
            }
            path += `${key}=${value}`;
        }
    }
    return path;
}

function extractCurrentAttemptId(pathname: string) {
    const PATH_REGEX =
        /^\/student\/students\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/attempts\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/take/;
    const result = pathname.match(PATH_REGEX);
    if (!result) {
        return undefined;
    }
    return result[2];
}

export { pathHandler };
