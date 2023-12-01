import Express from 'express';
import { buildAnonymousController, buildAuthenticatedController } from '../lib/buildController';
import { routes } from './routes';

const router = buildRouter();

function buildRouter() {
    const router = Express.Router();
    for (const route of routes) {
        const builtController = route.isAuthenticated
            ? buildAuthenticatedController(route.controller, {
                  checkAuthorization: route.checkAuthorization,
                  schema: route.schema,
              })
            : buildAnonymousController(route.controller, { schema: route.schema });
        switch (route.method) {
            case 'POST':
                router.post(route.path, builtController);
                break;
            case 'GET':
                router.get(route.path, builtController);
                break;
            case 'PATCH':
                router.patch(route.path, builtController);
                break;
            case 'PUT':
                router.put(route.path, builtController);
                break;
            case 'DELETE':
                router.delete(route.path, builtController);
                break;
        }
    }
    return router;
}

export { router };
