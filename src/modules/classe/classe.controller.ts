import { Establishment } from '../establishment';
import { User } from '../user';
import { buildClasseService } from './classe.service';

export { buildClasseController };

function buildClasseController() {
    const classeService = buildClasseService();
    const classeController = {
        createClasse,
        deleteClasse,
        getAllClasses,
        getClassesByEstablishment,
    };

    return classeController;

    async function getAllClasses() {
        return classeService.getAllClasses();
    }

    async function getClassesByEstablishment(params: {
        urlParams: { establishmentId: Establishment['id'] };
    }) {
        return classeService.getClassesByEstablishment(params.urlParams.establishmentId);
    }

    async function createClasse(params: {
        body: { name: string };
        urlParams: { establishmentId: Establishment['id'] };
    }) {
        return classeService.createClasse({
            className: params.body.name,
            establishmentId: params.urlParams.establishmentId,
        });
    }

    async function deleteClasse(params: { urlParams: { classeId: string } }) {
        return classeService.deleteClasse({ classeId: params.urlParams.classeId });
    }
}
