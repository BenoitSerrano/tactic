import { ResetPasswordRequest } from './ResetPasswordRequest.entity';
import { buildResetPasswordRequestService } from './resetPasswordRequest.service';

export { buildResetPasswordRequestController };

function buildResetPasswordRequestController() {
    const resetPasswordRequestService = buildResetPasswordRequestService();
    const resetPasswordRequestController = {
        createResetPasswordRequest,
        fetchResetPasswordRequestUser,
        resetPassword,
    };

    return resetPasswordRequestController;

    async function createResetPasswordRequest(params: { body: { email: string } }) {
        return resetPasswordRequestService.createResetPasswordRequest(params.body.email);
    }

    async function fetchResetPasswordRequestUser(params: {
        urlParams: { resetPasswordRequestId: ResetPasswordRequest['id'] };
    }) {
        return resetPasswordRequestService.fetchResetPasswordRequestUser(
            params.urlParams.resetPasswordRequestId,
        );
    }

    async function resetPassword(params: {
        body: { password: string };
        urlParams: { resetPasswordRequestId: ResetPasswordRequest['id'] };
    }) {
        return resetPasswordRequestService.resetPassword(
            params.urlParams.resetPasswordRequestId,
            params.body.password,
        );
    }
}
