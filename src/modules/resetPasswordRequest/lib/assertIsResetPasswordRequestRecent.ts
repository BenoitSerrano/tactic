import { ResetPasswordRequest } from '../ResetPasswordRequest.entity';

const TEN_MINUTES_IN_MILLISECONDS = 10 * 60 * 1000;

function assertIsResetPasswordRequestRecent(resetPasswordRequest: ResetPasswordRequest, now: Date) {
    const createdAtDate = new Date(resetPasswordRequest.createdAt);
    if (now.getTime() - createdAtDate.getTime() > TEN_MINUTES_IN_MILLISECONDS) {
        throw new Error(
            `resetPasswordRequest ${resetPasswordRequest.id} has been created more than 10 minutes ago`,
        );
    }
}

export { assertIsResetPasswordRequestRecent };
