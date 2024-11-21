import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const userConfigurationsApi = { updateDefaultEdgeText };

async function updateDefaultEdgeText({ kind, text }: { kind: 'start' | 'end'; text: string }) {
    const URL = `${BASE_URL}/user-configurations`;
    return performApiCall(URL, 'PATCH', { kind, text });
}

export { userConfigurationsApi };
