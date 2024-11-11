import { attemptRoutes } from './attemptRoutes';
import { examRoutes } from './examRoutes';
import { exerciseRoutes } from './exerciseRoutes';
import { classeRoutes } from './classeRoutes';
import { questionRoutes } from './questionRoutes';
import { resetPasswordRequestRoutes } from './resetPasswordRequestRoutes';
import { studentRoutes } from './studentRoutes';
import { routeType } from './types';
import { userConfigurationRoutes } from './userConfigurationRoutes';
import { userRoutes } from './userRoutes';
import { planRoutes } from './planRoutes';
import { establishmentRoutes } from './establishmentRoutes';

const routes = buildRoutes();

function buildRoutes() {
    const routes: routeType<any, any, any>[] = [];
    routes.push(...userRoutes);
    routes.push(...examRoutes);
    routes.push(...studentRoutes);
    routes.push(...classeRoutes);
    routes.push(...questionRoutes);
    routes.push(...attemptRoutes);
    routes.push(...exerciseRoutes);
    routes.push(...resetPasswordRequestRoutes);
    routes.push(...userConfigurationRoutes);
    routes.push(...planRoutes);
    routes.push(...establishmentRoutes);
    return routes;
}

export { routes };
