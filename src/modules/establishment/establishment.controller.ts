import { User } from '../user';
import { Establishment } from './Establishment.entity';
import { buildEstablishmentService } from './establishment.service';

export { buildEstablishmentController };

function buildEstablishmentController() {
    const establishmentService = buildEstablishmentService();
    const establishmentController = {
        getEstablishments,
        createEstablishment,
    };

    return establishmentController;

    async function getEstablishments(_params: {}, user: User) {
        return establishmentService.getEstablishmentsByUser(user);
    }

    async function createEstablishment(
        params: { body: { name: Establishment['name'] } },
        user: User,
    ) {
        return establishmentService.createEstablishment({ user, name: params.body.name });
    }
}
