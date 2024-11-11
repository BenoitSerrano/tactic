import { useLocation } from 'react-router-dom';
import { pathHandler } from './pathHandler';
import { localStorage } from './localStorage';

function useStoreCurrentLocation() {
    const location = useLocation();
    const parsedPath = pathHandler.parsePath(location.pathname);
    if (!parsedPath) {
        console.error(`Could not parse location ${location.pathname}`);
        return;
    }
    localStorage.lastPageVisitedHandler.set(parsedPath.routeKey, parsedPath.parameters);
}

export { useStoreCurrentLocation };
