import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const usersApi = {
    createUser,
    login,
    getUsersSummary,
};

async function createUser(params: { email: string; password: string }) {
    const URL = `${BASE_URL}/users`;
    return performApiCall(URL, 'POST', { email: params.email, password: params.password });
}

async function login(params: { email: string; password: string }) {
    const URL = `${BASE_URL}/login`;
    return performApiCall(URL, 'POST', { email: params.email, password: params.password });
}

async function getUsersSummary() {
    const URL = `${BASE_URL}/users-summary`;
    return performApiCall(URL, 'GET');
}

export { usersApi };
