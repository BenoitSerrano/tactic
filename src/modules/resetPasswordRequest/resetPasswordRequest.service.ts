import { MoreThan } from 'typeorm';
import { dataSource } from '../../dataSource';
import { User, buildUserService } from '../user';
import { ResetPasswordRequest } from './ResetPasswordRequest.entity';
import { mailer } from '../../lib/mailer';
import { assertIsResetPasswordRequestRecent } from './lib/assertIsResetPasswordRequestRecent';
import { MINUTES_ALLOWED_FOR_RESET_PASSWORD_REQUEST } from './constants';
import { logger } from '../../lib/logger';

export { buildResetPasswordRequestService };

function buildResetPasswordRequestService() {
    const resetPasswordRequestRepository = dataSource.getRepository(ResetPasswordRequest);
    const userService = buildUserService();
    const resetPasswordRequestService = {
        createResetPasswordRequest,
        getResetPasswordRequestWithUser,
        resetPassword,
    };

    return resetPasswordRequestService;

    async function getResetPasswordRequestWithUser(
        resetPasswordRequestId: ResetPasswordRequest['id'],
    ) {
        const resetPasswordRequest = await resetPasswordRequestRepository.findOneOrFail({
            where: {
                id: resetPasswordRequestId,
            },
            relations: ['user'],
        });
        const now = new Date();
        assertIsResetPasswordRequestRecent(resetPasswordRequest, now);
        return {
            ...resetPasswordRequest,
            user: { id: resetPasswordRequest.user.id, email: resetPasswordRequest.user.email },
        };
    }

    async function createResetPasswordRequest(email: User['email']) {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            logger.error(
                `No user associated to email adresse ${email}: cannot create reset password request`,
            );
            return true;
        }

        await assertNoRecentResetPasswordRequest(user);
        const results = await resetPasswordRequestRepository.insert({ user });
        if (results.identifiers.length === 0) {
            throw new Error(
                `Something happened while creating a reset password request for user ${user.id}.`,
            );
        }
        const resetPasswordRequestId: string = results.identifiers[0].id;
        await mailer.sendResetPasswordMail(email, resetPasswordRequestId);
        return true;
    }

    async function assertNoRecentResetPasswordRequest(user: User) {
        const now = new Date();
        const PERIOD_ALLOWED_FOR_RESET_PASSWORD_REQUEST =
            MINUTES_ALLOWED_FOR_RESET_PASSWORD_REQUEST * 60 * 1000;
        const THRESHOLD_DATE = new Date(now.getTime() - PERIOD_ALLOWED_FOR_RESET_PASSWORD_REQUEST);
        const resetPasswordRequests = await resetPasswordRequestRepository.find({
            where: { user: { id: user.id }, createdAt: MoreThan(THRESHOLD_DATE.toISOString()) },
        });

        if (resetPasswordRequests.length > 0) {
            throw new Error(
                `A reset password request has already been created for user ${user.email} less than 10 minutes ago. Wait and retry.`,
            );
        }
    }

    async function resetPassword(
        resetPasswordRequestId: ResetPasswordRequest['id'],
        password: string,
    ) {
        const resetPasswordRequest = await resetPasswordRequestRepository.findOneOrFail({
            where: { id: resetPasswordRequestId },
            relations: ['user'],
        });
        const now = new Date();
        assertIsResetPasswordRequestRecent(resetPasswordRequest, now);
        await userService.changePassword(resetPasswordRequest.user, password);
        await resetPasswordRequestRepository.delete({ user: { id: resetPasswordRequest.user.id } });
        return true;
    }
}
