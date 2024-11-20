import { ResetPasswordRequest } from './ResetPasswordRequest.entity';
import { buildResetPasswordRequestService } from './resetPasswordRequest.service';

export { buildResetPasswordRequestController };

function buildResetPasswordRequestController() {
    const resetPasswordRequestService = buildResetPasswordRequestService();
    const resetPasswordRequestController = {
        createResetPasswordRequest,
        getResetPasswordRequestWithUser,
        resetPassword,
    };

    return resetPasswordRequestController;

    async function createResetPasswordRequest(params: { body: { email: string } }) {
        return resetPasswordRequestService.createResetPasswordRequest(params.body.email);
    }

    async function getResetPasswordRequestWithUser(params: {
        urlParams: { resetPasswordRequestId: ResetPasswordRequest['id'] };
    }) {
        return resetPasswordRequestService.getResetPasswordRequestWithUser(
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
