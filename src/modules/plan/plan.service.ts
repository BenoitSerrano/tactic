import { dataSource } from '../../dataSource';
import { Plan } from './Plan.entity';

export { buildPlanService };

function buildPlanService() {
    const planRepository = dataSource.getRepository(Plan);

    const planService = {
        findFreePlan,
    };

    return planService;

    async function findFreePlan(): Promise<Plan> {
        const freePlan = planRepository.findOneOrFail({ where: { name: 'FREE' } });
        return freePlan;
    }
}
