import { routeType } from './types';
import { buildPackageController } from '../modules/package';

const packageController = buildPackageController();

const packageRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/packages',
        kind: 'public',
        controller: packageController.getPackages,
    },
];

export { packageRoutes };
