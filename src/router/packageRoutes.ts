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
    {
        method: 'GET',
        path: '/all-packages',
        kind: 'public',
        controller: packageController.getAllPackages,
    },
    {
        method: 'GET',
        path: '/packages/:packageId',
        kind: 'public',
        controller: packageController.getPackage,
    },
];

export { packageRoutes };
