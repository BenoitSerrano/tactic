import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

type classeType = { id: string; name: string };

const classesApi = { createClasse };

async function createClasse(params: {
    name: string;
    establishmentId: string;
}): Promise<classeType> {
    const URL = `${BASE_URL}/establishments/${params.establishmentId}/classes`;
    return performApiCall(URL, 'POST', { name: params.name });
}

export { classesApi };
export type { classeType };
