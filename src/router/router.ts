import Express from 'express';
import { buildAnonymousController, buildAuthenticatedController } from '../lib/buildController';
import { routes } from './routes';
import { mailer } from '../lib/mailer';

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

    router.get('/test', async (req, res) => {
        const account = await mailer.getAccount();
        res.send(account);
    });

    return router;
}

export { router };
