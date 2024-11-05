import { dataSource } from '../../dataSource';
import { Classe } from './Classe.entity';
import { User } from '../user';

export { buildClasseService };

function buildClasseService() {
    const classeRepository = dataSource.getRepository(Classe);

    const classeService = {
        getAllClasses,
        fetchClasses,
        getClasse,
        createClasse,
        deleteClasse,
    };

    return classeService;

    async function getAllClasses() {
        const classes = await classeRepository.find({
            relations: ['user'],
            select: { user: { id: true } },
        });

        return classes;
    }

    async function fetchClasses(user: User) {
        // TODO
        // const classes = await classeRepository.find({
        //     where: { user: { id: user.id } },
        // });
        const classes: any[] = [];
        return classes;
    }

    async function getClasse(classeId: Classe['id']) {
        const classe = await classeRepository.findOneOrFail({
            where: { id: classeId },
        });
        return classe;
    }

    async function createClasse(criteria: { user: User }, params: { name: Classe['name'] }) {
        const { user } = criteria;
        //TODO

        // await classeRepository.insert({ user, name: params.name });
        await classeRepository.insert({ name: params.name });
        return true;
    }

    async function deleteClasse(criteria: { classeId: Classe['id'] }) {
        const result = await classeRepository.delete({ id: criteria.classeId });
        return result.affected == 1;
    }
}
