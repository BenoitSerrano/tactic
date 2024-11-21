import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

type userApiType = { id: string; email: string };

const resetPasswordRequestsApi = {
    getResetPasswordRequestWithUser,
    createResetPasswordRequest,
};

async function getResetPasswordRequestWithUser(
    resetPasswordRequestId: string,
): Promise<{ id: string; user: userApiType }> {
    const URL = `${BASE_URL}/reset-password-requests/${resetPasswordRequestId}/with-user`;
    return performApiCall(URL, 'GET');
}

async function createResetPasswordRequest(email: string) {
    const URL = `${BASE_URL}/reset-password-requests`;
    return performApiCall(URL, 'POST', {
        email,
    });
}

export { resetPasswordRequestsApi };
