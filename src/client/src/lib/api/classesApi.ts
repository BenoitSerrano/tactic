import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

type classeType = { id: string; name: string };

const classesApi = { createClasse, updateClasseEstablishmentId, updateClasseName, deleteClasse };

async function createClasse(params: {
    name: string;
    establishmentId: string;
}): Promise<classeType> {
    const URL = `${BASE_URL}/establishments/${params.establishmentId}/classes`;
    return performApiCall(URL, 'POST', { name: params.name });
}

async function updateClasseEstablishmentId(params: { establishmentId: string; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/establishmentId`;
    return performApiCall(URL, 'PATCH', { establishmentId: params.establishmentId });
}

async function updateClasseName({ classeId, name }: { classeId: string; name: string }) {
    const URL = `${BASE_URL}/classes/${classeId}/name`;
    return performApiCall(URL, 'PATCH', { name });
}

async function deleteClasse(params: { classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}`;
    return performApiCall(URL, 'DELETE');
}

export { classesApi };
export type { classeType };
