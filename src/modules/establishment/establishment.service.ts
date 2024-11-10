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
        updateEstablishment,
        getExamIdsByUser,
    };

    return establishmentService;

    async function getEstablishmentsWithClasses(user: User) {
        const establishments = await establishmentRepository.find({
            where: { user: { id: user.id } },
            relations: { user: true, classes: true },
            select: { id: true, name: true, classes: { id: true, name: true }, user: { id: true } },
        });
        return establishments;
    }

    async function getExamIdsByUser(userId: User['id']) {
        const establishments = await establishmentRepository.find({
            where: { user: { id: userId } },
            relations: { classes: { exams: true } },
            select: { id: true, classes: { id: true, exams: { id: true } } },
        });
        let examIds: Exam['id'][] = [];
        for (const establishment of establishments) {
            console.log(establishment);
            for (const classe of establishment.classes) {
                for (const exam of classe.exams) {
                    examIds.push(exam.id);
                }
            }
        }
        return examIds;
    }

    async function createEstablishment(params: { name: Establishment['name']; user: User }) {
        const establishment = new Establishment();
        establishment.name = params.name;
        establishment.user = params.user;
        const insertedEstablishment = await establishmentRepository.save(establishment);
        return insertedEstablishment;
    }
    async function updateEstablishment(
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
