import { Establishment } from '../establishment';
import { buildEstablishmentService } from '../establishment/establishment.service';
import { User } from '../user';
import { Classe } from './Classe.entity';
import { buildClasseService } from './classe.service';

export { buildClasseController };

function buildClasseController() {
    const classeService = buildClasseService();
    const establishmentService = buildEstablishmentService();
    const classeController = {
        createClasse,
        deleteClasse,
        getAllClasses,
        updateClasseEstablishmentId,
        bulkUpdateClasseEstablishmentId,
        updateClasseName,
    };

    return classeController;

    async function getAllClasses() {
        return classeService.getAllClasses();
    }

    async function updateClasseEstablishmentId(params: {
        body: { establishmentId: Establishment['id'] };
        urlParams: { classeId: Classe['id'] };
    }) {
        return classeService.updateClasseEstablishmentId(
            { classeId: params.urlParams.classeId },
            params.body.establishmentId,
        );
    }

    async function bulkUpdateClasseEstablishmentId(
        params: {
            body: { establishments: Array<{ id: Establishment['id']; classeIds: string[] }> };
        },
        user: User,
    ) {
        await Promise.all(
            params.body.establishments.map((establishment) =>
                establishmentService.assertEstablishmentBelongsToUser(establishment.id, user),
            ),
        );
        return classeService.bulkUpdateClasseEstablishmentId({
            establishments: params.body.establishments,
            user,
        });
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
            classeName: params.body.name,
            establishmentId: params.urlParams.establishmentId,
            user,
        });
    }

    async function deleteClasse(params: { urlParams: { classeId: string } }) {
        return classeService.deleteClasse({ classeId: params.urlParams.classeId });
    }
}
