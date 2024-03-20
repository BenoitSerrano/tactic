import { ROUTE_KEYS } from '../routes/routeKeys';
import { ROUTE_PATHS } from '../routes/routePaths';

const pathHandler = {
    extractCurrentAttemptId,
    getRoutePath,
    parsePath,
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

function parsePath(
    path: string,
): { parameters: Record<string, string>; routeKey: (typeof ROUTE_KEYS)[number] } | undefined {
    const splitActualPath = path.split('/');

    routeKeysLoop: for (const ROUTE_KEY of ROUTE_KEYS) {
        const parameters: any = {};

        const ROUTE_PATH = ROUTE_PATHS[ROUTE_KEY].path;
        const splitCanonicalPath = ROUTE_PATH.split('/');
        if (splitActualPath.length !== splitCanonicalPath.length) {
            continue;
        }
        const chunkCount = splitActualPath.length;
        for (let i = 0; i < chunkCount; i++) {
            const actualPathChunk = splitActualPath[i];
            const canonicalPathChunk = splitCanonicalPath[i];
            if (canonicalPathChunk.length > 0 && canonicalPathChunk[0] === ':') {
                const parameterKey = canonicalPathChunk.substring(1);
                const parameterValue = actualPathChunk;
                parameters[parameterKey] = parameterValue;
            } else if (canonicalPathChunk !== actualPathChunk) {
                continue routeKeysLoop;
            }
        }
        return { parameters, routeKey: ROUTE_KEY };
    }
    return undefined;
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
