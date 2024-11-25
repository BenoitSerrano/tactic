import { dataSource } from '../../dataSource';
import { Classe } from './Classe.entity';
import { Establishment } from '../establishment';
import { User } from '../user';
import { buildEstablishmentService } from '../establishment/establishment.service';

export { buildClasseService };

function buildClasseService() {
    const classeRepository = dataSource.getRepository(Classe);

    const classeService = {
        getAllClasses,
        getClasseIdsByEstablishment,
        getClasse,
        createClasse,
        deleteClasse,
        updateClasseEstablishmentId,
        updateClasseName,
    };

    return classeService;

    async function getAllClasses() {
        const classes = await classeRepository.find({
            relations: ['user', 'establishment'],
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

    async function getClasseIdsByEstablishment(establishmentId: Establishment['id']) {
        const classes = await classeRepository.find({
            where: { establishment: { id: establishmentId } },
            relations: { establishment: true },
            select: { id: true, establishment: { id: true } },
        });
        return classes;
    }

    async function createClasse(params: {
        classeName: Classe['name'];
        establishmentId: Establishment['id'];
        user: User;
    }) {
        const establishmentService = buildEstablishmentService();
        const { establishmentId, classeName, user } = params;
        const establishment = await establishmentService.getEstablishment(establishmentId);
        const classe = new Classe();
        classe.name = classeName;
        classe.establishment = establishment;
        classe.user = user;
        const insertedClasse = await classeRepository.save(classe);
        return insertedClasse;
    }

    async function deleteClasse(criteria: { classeId: Classe['id'] }) {
        const result = await classeRepository.delete({ id: criteria.classeId });
        return result.affected == 1;
    }

    async function updateClasseEstablishmentId(
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
    async function updateClasseName(critera: { classeId: Classe['id'] }, name: Classe['name']) {
        const result = await classeRepository.update({ id: critera.classeId }, { name });
        if (result.affected !== 1) {
            throw new Error(`Could not update classe ${critera.classeId}`);
        }
        return true;
    }
}
