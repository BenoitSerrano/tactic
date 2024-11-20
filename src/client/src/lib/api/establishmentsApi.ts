import { classeType } from './classesApi';
import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

type establishmentWithClassesType = {
    id: string;
    name: string;
    classes: Array<classeType>;
};

const establishmentsApi = {
    getEstablishmentsWithClasses,
    createEstablishment,
    updateEstablishmentName,
};

async function getEstablishmentsWithClasses(): Promise<Array<establishmentWithClassesType>> {
    const URL = `${BASE_URL}/establishments/with-classes`;
    return performApiCall(URL, 'GET');
}

async function updateEstablishmentName({
    establishmentId,
    name,
}: {
    establishmentId: string;
    name: string;
}) {
    const URL = `${BASE_URL}/establishments/${establishmentId}/name`;
    return performApiCall(URL, 'PATCH', { name });
}

async function createEstablishment(params: {
    name: string;
}): Promise<{ id: string; name: string }> {
    const URL = `${BASE_URL}/establishments`;
    return performApiCall(URL, 'POST', { name: params.name });
}
export { establishmentsApi };
export type { establishmentWithClassesType };
