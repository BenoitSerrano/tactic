import Express, { Router } from 'express';
import { buildAnonymousController, buildAuthenticatedController } from './lib/buildController';
import { routes } from './routes';
import { webhooks } from './webhooks';
import { controllerType, methodType } from './types';

const apiRouter = buildApiRouter();
const webhookRouter = buildWebhookRouter();

function buildApiRouter() {
    const router = Express.Router();
    for (const route of routes) {
        const builtController =
            route.kind === 'authenticated'
                ? buildAuthenticatedController(route.controller, {
                      authorizedRoles: route.authorizedRoles,
                      checkAuthorization: route.checkAuthorization,
                      schema: route.schema,
                  })
                : buildAnonymousController(route.controller, { schema: route.schema });

        addRouteToRouter(router, route.method, route.path, builtController);
    }

    return router;
}

function buildWebhookRouter() {
    const router = Express.Router();

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

export { apiRouter, webhookRouter };
