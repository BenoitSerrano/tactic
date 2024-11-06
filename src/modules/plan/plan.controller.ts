import { buildPlanService } from './plan.service';

export { buildPlanController };

function buildPlanController() {
    const planService = buildPlanService();
    const planController = {
        getAllPlans,
    };

    return planController;

    async function getAllPlans() {
        return planService.getAllPlans();
    }
}
