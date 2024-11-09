import { dataSource } from '../../dataSource';
import { User } from '../user';
import { Establishment } from './Establishment.entity';

export { buildEstablishmentService };

function buildEstablishmentService() {
    const establishmentRepository = dataSource.getRepository(Establishment);
    const establishmentService = { getEstablishmentsByUser, createEstablishment };

    return establishmentService;

    async function getEstablishmentsByUser(user: User) {
        const establishments = await establishmentRepository.find({
            where: { user: { id: user.id } },
            relations: { user: true },
            select: { user: { id: true } },
        });
        return establishments;
    }

    async function createEstablishment(params: { name: Establishment['name']; user: User }) {
        const establishment = new Establishment();
        establishment.name = params.name;
        establishment.user = params.user;
        const insertedEstablishment = await establishmentRepository.save(establishment);
        return insertedEstablishment;
    }
}
