import { User } from '../user';
import { buildClasseService } from './classe.service';

export { buildClasseController };

function buildClasseController() {
    const classeService = buildClasseService();
    const classeController = {
        fetchClasses,
        createClasse,
        deleteClasse,
        getAllClasses,
    };

    return classeController;

    async function getAllClasses() {
        return classeService.getAllClasses();
    }

    async function fetchClasses(_params: {}, user: User) {
        return classeService.fetchClasses(user);
    }

    async function createClasse(params: { body: { name: string } }, user: User) {
        return classeService.createClasse({ user }, { name: params.body.name });
    }

    async function deleteClasse(params: { urlParams: { classeId: string } }) {
        return classeService.deleteClasse({ classeId: params.urlParams.classeId });
    }
}
