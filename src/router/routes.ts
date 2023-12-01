import { attemptRoutes } from './attemptRoutes';
import { examRoutes } from './examRoutes';
import { exerciseRoutes } from './exerciseRoutes';
import { groupRoutes } from './groupRoutes';
import { questionRoutes } from './questionRoutes';
import { studentRoutes } from './studentRoutes';
import { routeType } from './types';
import { userRoutes } from './userRoutes';

const routes = buildRoutes();

function buildRoutes() {
    const routes: routeType<any, any>[] = [];
    routes.push(...userRoutes);
    routes.push(...examRoutes);
    routes.push(...studentRoutes);
    routes.push(...groupRoutes);
    routes.push(...questionRoutes);
    routes.push(...attemptRoutes);
    routes.push(...exerciseRoutes);
    return routes;
}

export { routes };
