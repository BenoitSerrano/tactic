import { ROUTE_KEYS } from '../../routes/routeKeys';

const KEY = 'TACTIC_LAST_PAGE_VISITED';
const PARAMETERS_KEY = `${KEY}-PARAMETERS`;
const ROUTE_KEY_KEY = `${KEY}-KEY`;

function get() {
    const storedRouteKey = localStorage.getItem(ROUTE_KEY_KEY);
    const storedParameters = localStorage.getItem(PARAMETERS_KEY);
    return parseRoute(storedRouteKey, storedParameters);
}

function set(ROUTE_KEY: (typeof ROUTE_KEYS)[number], parameters: Record<string, string>) {
    localStorage.setItem(ROUTE_KEY_KEY, ROUTE_KEY);
    localStorage.setItem(PARAMETERS_KEY, JSON.stringify(parameters));
}

function remove() {
    localStorage.removeItem(ROUTE_KEY_KEY);
    localStorage.removeItem(PARAMETERS_KEY);
}

function parseRoute(storedRouteKey: string | null, storedParameters: string | null) {
    if (!storedRouteKey || !ROUTE_KEYS.includes(storedRouteKey as (typeof ROUTE_KEYS)[number])) {
        return undefined;
    }
    const ROUTE_KEY = storedRouteKey as (typeof ROUTE_KEYS)[number];

    return { ROUTE_KEY, parameters: storedParameters ? JSON.parse(storedParameters) : {} };
}

const lastPageVisitedHandler = { get, set, remove };

export { lastPageVisitedHandler };
