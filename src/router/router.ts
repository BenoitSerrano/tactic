import Express, { Router } from 'express';
import { buildAnonymousController, buildAuthenticatedController } from './lib/buildController';
import { routes } from './routes';
import { controllerType, methodType } from './types';
import { webhooks } from './webhooks';

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

        addRouteToRouter(router, route.method, route.path, builtController);
    }

    for (const webhook of webhooks) {
        addRouteToRouter(router, webhook.method, webhook.path, webhook.controller);
    }
    return router;
}

function addRouteToRouter(
    router: Router,
    method: methodType,
    path: string,
    controller: controllerType,
) {
    switch (method) {
        case 'POST':
            router.post(path, controller);
            break;
        case 'GET':
            router.get(path, controller);
            break;
        case 'PATCH':
            router.patch(path, controller);
            break;
        case 'PUT':
            router.put(path, controller);
            break;
        case 'DELETE':
            router.delete(path, controller);
            break;
    }
}

export { router };
