import { User } from '../user';
import { Establishment } from './Establishment.entity';
import { buildEstablishmentService } from './establishment.service';

export { buildEstablishmentController };

function buildEstablishmentController() {
    const establishmentService = buildEstablishmentService();
    const establishmentController = {
        getEstablishmentsWithClasses,
        createEstablishment,
        updateEstablishment,
    };

    return establishmentController;

    async function getEstablishmentsWithClasses(_params: {}, user: User) {
        return establishmentService.getEstablishmentsWithClasses(user);
    }

    async function createEstablishment(
        params: { body: { name: Establishment['name'] } },
        user: User,
    ) {
        return establishmentService.createEstablishment({ user, name: params.body.name });
    }

    async function updateEstablishment(params: {
        body: { name: Establishment['name'] };
        urlParams: { establishmentId: string };
    }) {
        return establishmentService.updateEstablishment(params.urlParams.establishmentId, {
            name: params.body.name,
        });
    }
}
