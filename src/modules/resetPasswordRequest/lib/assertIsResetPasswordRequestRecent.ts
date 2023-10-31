import { ResetPasswordRequest } from '../ResetPasswordRequest.entity';
import { MINUTES_ALLOWED_FOR_RESET_PASSWORD_REQUEST } from '../constants';

const TIME_ALLOWED_FOR_RESET_PASSWORD_REQUEST =
    MINUTES_ALLOWED_FOR_RESET_PASSWORD_REQUEST * 60 * 1000;

function assertIsResetPasswordRequestRecent(resetPasswordRequest: ResetPasswordRequest, now: Date) {
    const createdAtDate = new Date(resetPasswordRequest.createdAt);
    if (now.getTime() - createdAtDate.getTime() > TIME_ALLOWED_FOR_RESET_PASSWORD_REQUEST) {
        throw new Error(
            `resetPasswordRequest ${resetPasswordRequest.id} has been created more than 10 minutes ago`,
        );
    }
}

export { assertIsResetPasswordRequestRecent };
