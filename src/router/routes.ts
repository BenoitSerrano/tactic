import { attemptRoutes } from './attemptRoutes';
import { examRoutes } from './examRoutes';
import { exerciseRoutes } from './exerciseRoutes';
import { groupRoutes } from './groupRoutes';
import { questionRoutes } from './questionRoutes';
import { resetPasswordRequestRoutes } from './resetPasswordRequestRoutes';
import { studentRoutes } from './studentRoutes';
import { routeType } from './types';
import { userConfigurationRoutes } from './userConfigurationRoutes';
import { userRoutes } from './userRoutes';

const routes = buildRoutes();

function buildRoutes() {
    const routes: routeType<any, any, any>[] = [];
    routes.push(...userRoutes);
    routes.push(...examRoutes);
    routes.push(...studentRoutes);
    routes.push(...groupRoutes);
    routes.push(...questionRoutes);
    routes.push(...attemptRoutes);
    routes.push(...exerciseRoutes);
    routes.push(...resetPasswordRequestRoutes);
    routes.push(...userConfigurationRoutes);
    return routes;
}

export { routes };
