import { dataSource } from '../../dataSource';
import { Classe } from './Classe.entity';
import { Establishment } from '../establishment';

export { buildClasseService };

function buildClasseService() {
    const classeRepository = dataSource.getRepository(Classe);

    const classeService = {
        getAllClasses,
        getClassesByEstablishment,
        getClasse,
        createClasse,
        deleteClasse,
        updateEstablishmentId,
    };

    return classeService;

    async function getAllClasses() {
        const classes = await classeRepository.find({
            relations: ['user'],
            select: { user: { id: true } },
        });

        return classes;
    }

    async function getClasse(classeId: Classe['id']) {
        const classe = await classeRepository.findOneOrFail({
            where: { id: classeId },
        });
        return classe;
    }

    async function getClassesByEstablishment(establishmentId: Establishment['id']) {
        const classes = await classeRepository.find({
            where: { establishment: { id: establishmentId } },
            relations: { establishment: true },
            select: { establishment: { id: true } },
        });
        return classes;
    }

    async function createClasse(params: {
        className: Classe['name'];
        establishmentId: Establishment['id'];
    }) {
        const { establishmentId, className } = params;

        await classeRepository.insert({
            name: className,
            establishment: { id: establishmentId },
        });
        return true;
    }

    async function deleteClasse(criteria: { classeId: Classe['id'] }) {
        const result = await classeRepository.delete({ id: criteria.classeId });
        return result.affected == 1;
    }

    async function updateEstablishmentId(
        critera: { classeId: Classe['id'] },
        newEstablishmentId: Establishment['id'],
    ) {
        const result = await classeRepository.update(
            { id: critera.classeId },
            { establishment: { id: newEstablishmentId } },
        );
        if (result.affected !== 1) {
            throw new Error(`Could not update classe ${critera.classeId}`);
        }
        return true;
    }
}
