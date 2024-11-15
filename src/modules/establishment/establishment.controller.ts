import { User } from '../user';
import { Establishment } from './Establishment.entity';
import { buildEstablishmentService } from './establishment.service';

export { buildEstablishmentController };

function buildEstablishmentController() {
    const establishmentService = buildEstablishmentService();
    const establishmentController = {
        getEstablishmentsWithClasses,
        createEstablishment,
        updateEstablishmentName,
        getAllEstablishments,
    };

    return establishmentController;

    async function getAllEstablishments() {
        return establishmentService.getAllEstablishments();
    }

    async function getEstablishmentsWithClasses(_params: {}, user: User) {
        return establishmentService.getEstablishmentsWithClasses(user);
    }

    async function createEstablishment(
        params: { body: { name: Establishment['name'] } },
        user: User,
    ) {
        return establishmentService.createEstablishment({ user, name: params.body.name });
    }

    async function updateEstablishmentName(params: {
        body: { name: Establishment['name'] };
        urlParams: { establishmentId: string };
    }) {
        return establishmentService.updateEstablishmentName(params.urlParams.establishmentId, {
            name: params.body.name,
        });
    }
}
