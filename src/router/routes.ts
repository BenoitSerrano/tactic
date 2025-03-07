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
import { establishmentRoutes } from './establishmentRoutes';
import { packageRoutes } from './packageRoutes';
import { paymentRoutes } from './paymentRoutes';

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
    routes.push(...establishmentRoutes);
    routes.push(...packageRoutes);
    routes.push(...paymentRoutes);
    return routes;
}

export { routes };
