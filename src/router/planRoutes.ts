import { buildPlanController } from '../modules/plan';
import { routeType } from './types';

const planController = buildPlanController();

const planRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/all-plans',
        kind: 'public',
        controller: planController.getAllPlans,
    },
];

export { planRoutes };
