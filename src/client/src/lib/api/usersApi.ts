import { userInfoType } from '../../constants';
import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const usersApi = {
    getUsersSummary,
    updateUserPasswordByResetPasswordRequest,
    createUser,
    login,
};

async function getUsersSummary() {
    const URL = `${BASE_URL}/users-summary`;
    return performApiCall(URL, 'GET');
}

async function updateUserPasswordByResetPasswordRequest({
    password,
    resetPasswordRequestId,
}: {
    password: string;
    resetPasswordRequestId: string;
}) {
    const URL = `${BASE_URL}/reset-password-requests/${resetPasswordRequestId}/user/password`;
    return performApiCall(URL, 'PATCH', { password });
}

async function createUser(params: {
    email: string;
    password: string;
    establishmentName: string;
    classeName: string;
}): Promise<{ token: string; userInfo: userInfoType }> {
    const URL = `${BASE_URL}/users`;
    return performApiCall(URL, 'POST', {
        email: params.email,
        password: params.password,
        establishmentName: params.establishmentName,
        classeName: params.classeName,
    });
}

async function login(params: {
    email: string;
    password: string;
}): Promise<{ token: string; userInfo: userInfoType }> {
    const URL = `${BASE_URL}/login`;
    return performApiCall(URL, 'POST', { email: params.email, password: params.password });
}

export { usersApi };
