import { config } from '../../config';
import { dataSource } from '../../dataSource';
import { hasher } from '../../lib/hasher';
import { mailer } from '../../lib/mailer';
import { signer } from '../../lib/signer';
import { buildAttemptService } from '../attempt';
import { buildClasseService, Classe } from '../classe';
import { Establishment } from '../establishment';
import { buildEstablishmentService } from '../establishment/establishment.service';
import { buildUserConfigurationService } from '../userConfiguration';
import { User } from './User.entity';

export { buildUserService };

function buildUserService() {
    const userRepository = dataSource.getRepository(User);
    const userConfigurationService = buildUserConfigurationService();

    const userService = {
        createUser,
        findUserByEmail,
        login,
        getAllUsersWithoutPassword,
        bulkInsertUsers,
        changePassword,
        addPapers,
        getUserRemainingPapers,
        getUsersSummary,
        decreaseRemainingPapers,
        updateStripeCustomerId,
        updateAttemptsTreatedAt,
    };

    return userService;

    async function createUser(params: {
        email: string;
        password: string;
        establishmentName: Establishment['name'];
        classeName: Classe['name'];
    }) {
        const newUserConfiguration = await userConfigurationService.createUserConfiguration();
        const newUser = new User();
        newUser.roles = ['teacher'];
        newUser.email = params.email;
        newUser.hashedPassword = hasher.hash(params.password);
        newUser.userConfiguration = newUserConfiguration;
        newUser.remainingPapers = config.FREE_PAPERS_COUNT;

        const result = await userRepository.insert(newUser);
        if (result.identifiers.length !== 1) {
            throw new Error(
                `Something wrong happened. ${result.identifiers.length} users were created.`,
            );
        }
        newUser.id = result.identifiers[0].id;

        const establishmentService = buildEstablishmentService();
        const establishment = await establishmentService.createEstablishment({
            name: params.establishmentName,
            user: newUser,
        });

        const classeService = buildClasseService();
        await classeService.createClasse({
            classeName: params.classeName,
            establishmentId: establishment.id,
            user: newUser,
        });

        await mailer.registerContact(params.email);
        const token = createJwt({
            userId: newUser.id,
            email: params.email,
            roles: newUser.roles,
        });
        const userInfo = {
            email: params.email,
            roles: newUser.roles,
            remainingPapers: newUser.remainingPapers,
        };
        return { token, userInfo };
    }

    function createJwt(params: { userId: User['id']; email: User['email']; roles: User['roles'] }) {
        return signer.sign(params);
    }

    async function findUserByEmail(email: User['email']) {
        return userRepository.findOneBy({ email });
    }

    async function login(email: string, password: string) {
        const user = await userRepository.findOneOrFail({ where: { email } });

        const isPasswordCorrect = hasher.verify(password, user.hashedPassword);

        if (isPasswordCorrect) {
            const token = createJwt({ userId: user.id, email: user.email, roles: user.roles });
            const userInfo = { email, roles: user.roles, remainingPapers: user.remainingPapers };

            return { token, userInfo };
        } else {
            throw new Error(`The password sent does not match the hashed stored password`);
        }
    }

    async function getAllUsersWithoutPassword() {
        const users = await userRepository.find({
            relations: ['userConfiguration'],
            select: { userConfiguration: { id: true } },
        });

        return users.map((user) => ({ ...user, hashedPassword: '' }));
    }

    async function bulkInsertUsers(users: Array<User>) {
        return userRepository.insert(users);
    }

    async function addPapers(user: User, papersToAdd: number) {
        return userRepository.update(
            { id: user.id },
            { remainingPapers: user.remainingPapers + papersToAdd },
        );
    }

    async function getUserRemainingPapers(user: User) {
        return { remainingPapers: user.remainingPapers };
    }

    async function changePassword(user: User, newPassword: string) {
        const hashedPassword = hasher.hash(newPassword);
        const result = await userRepository.update({ id: user.id }, { hashedPassword });
        return result.affected === 1;
    }

    async function getUsersSummary() {
        const users = await userRepository.find({
            relations: ['exams'],
            select: {
                id: true,
                email: true,
                roles: true,
                exams: { id: true },
            },
        });
        return users.map(({ id, email, roles, exams }) => ({
            id,
            email,
            roles,
            examsCount: exams.length,
        }));
    }

    async function decreaseRemainingPapers(user: User) {
        if (user.remainingPapers <= 0) {
            throw new Error(
                `Could not decrease remaining papers for user ${user.id}: remainingPapers = ${user.remainingPapers}`,
            );
        }
        return userRepository.update(
            { id: user.id },
            { remainingPapers: user.remainingPapers - 1 },
        );
    }

    async function updateStripeCustomerId(userId: User['id'], stripeCustomerId: string) {
        const result = await userRepository.update({ id: userId }, { stripeCustomerId });
        if (result.affected !== 1) {
            throw new Error(`Could not find user "${userId}" to update stripe customer id`);
        }
    }

    async function updateAttemptsTreatedAt(userId: User['id']) {
        const attemptService = buildAttemptService();
        const { remainingPapers } = await userRepository.findOneOrFail({
            where: { id: userId },
            select: { id: true, remainingPapers: true },
        });
        const treatedAttemptCount = await attemptService.updateNonTreatedAttempts(
            userId,
            remainingPapers,
        );
        return userRepository.update(
            { id: userId },
            { remainingPapers: remainingPapers - treatedAttemptCount },
        );
    }
}
