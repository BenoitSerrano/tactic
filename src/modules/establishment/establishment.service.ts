import { dataSource } from '../../dataSource';
import { Exam } from '../exam';
import { User } from '../user';
import { Establishment } from './Establishment.entity';

export { buildEstablishmentService };

function buildEstablishmentService() {
    const establishmentRepository = dataSource.getRepository(Establishment);
    const establishmentService = {
        getEstablishmentsWithClasses,
        createEstablishment,
        updateEstablishmentName,
        getEstablishment,
        getAllEstablishments,
        assertEstablishmentBelongsToUser,
    };

    return establishmentService;

    async function getEstablishmentsWithClasses(user: User) {
        const establishments = await establishmentRepository.find({
            where: { user: { id: user.id } },
            order: { name: 'ASC' },
            relations: { user: true, classes: true },
            select: { id: true, name: true, classes: { id: true, name: true }, user: { id: true } },
        });
        return establishments;
    }

    async function assertEstablishmentBelongsToUser(
        establishmentId: Establishment['id'],
        user: User,
    ) {
        const establishment = await establishmentRepository.findOneOrFail({
            where: { id: establishmentId },
            relations: ['user'],
            select: { id: true, user: { id: true } },
        });
        if (establishment.user.id !== user.id) {
            throw new Error(
                `Error: establishment ${establishmentId} does not belong to user ${user.id}`,
            );
        }
    }

    async function getAllEstablishments() {
        const establishments = await establishmentRepository.find({
            relations: ['user'],
        });

        return establishments;
    }

    async function getEstablishment(establishmentId: Establishment['id']) {
        return establishmentRepository.findOneOrFail({ where: { id: establishmentId } });
    }

    async function createEstablishment(params: { name: Establishment['name']; user: User }) {
        const establishment = new Establishment();
        establishment.name = params.name;
        establishment.user = params.user;
        const insertedEstablishment = await establishmentRepository.save(establishment);
        return insertedEstablishment;
    }

    async function updateEstablishmentName(
        establishmentId: Establishment['id'],
        params: { name: Establishment['name'] },
    ) {
        const result = await establishmentRepository.update(
            { id: establishmentId },
            { name: params.name },
        );
        if (result.affected !== 1) {
            throw new Error(
                `Error: couldn't find establishment ${establishmentId} (results.affected = ${result.affected})`,
            );
        }
        return true;
    }
}
