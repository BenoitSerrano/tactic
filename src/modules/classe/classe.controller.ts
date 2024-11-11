import { Establishment } from '../establishment';
import { User } from '../user';
import { Classe } from './Classe.entity';
import { buildClasseService } from './classe.service';

export { buildClasseController };

function buildClasseController() {
    const classeService = buildClasseService();
    const classeController = {
        createClasse,
        deleteClasse,
        getAllClasses,
        getClassesByEstablishment,
        updateEstablishmentId,
        updateClasseName,
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

    async function updateEstablishmentId(params: {
        body: { establishmentId: Establishment['id'] };
        urlParams: { classeId: Classe['id'] };
    }) {
        return classeService.updateEstablishmentId(
            { classeId: params.urlParams.classeId },
            params.body.establishmentId,
        );
    }
    async function updateClasseName(params: {
        body: { name: Classe['name'] };
        urlParams: { classeId: Classe['id'] };
    }) {
        return classeService.updateClasseName(
            { classeId: params.urlParams.classeId },
            params.body.name,
        );
    }

    async function createClasse(
        params: {
            body: { name: string };
            urlParams: { establishmentId: Establishment['id'] };
        },
        user: User,
    ) {
        return classeService.createClasse({
            className: params.body.name,
            establishmentId: params.urlParams.establishmentId,
            user,
        });
    }

    async function deleteClasse(params: { urlParams: { classeId: string } }) {
        return classeService.deleteClasse({ classeId: params.urlParams.classeId });
    }
}
