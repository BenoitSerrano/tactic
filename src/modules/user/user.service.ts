import { dataSource } from '../../dataSource';
import { hasher } from '../../lib/hasher';
import { mailer } from '../../lib/mailer';
import { mapEntities } from '../../lib/mapEntities';
import { signer } from '../../lib/signer';
import { Plan, buildPlanService } from '../plan';
import { buildUserConfigurationService } from '../userConfiguration';
import { User } from './User.entity';

export { buildUserService };

function buildUserService() {
    const userRepository = dataSource.getRepository(User);
    const planService = buildPlanService();
    const userConfigurationService = buildUserConfigurationService();

    const userService = {
        createUser,
        findUserByEmail,
        login,
        getAllAnonymizedUsers,
        bulkInsertUsers,
        changePassword,
        findPlanForUser,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const newUserConfiguration = await userConfigurationService.createUserConfiguration();
        const newUser = new User();
        newUser.email = email;
        newUser.hashedPassword = hasher.hash(password);
        newUser.userConfiguration = newUserConfiguration;

        const freePlan = await planService.findFreePlan();
        newUser.plan = freePlan;

        const result = await userRepository.insert(newUser);
        if (result.identifiers.length !== 1) {
            throw new Error(
                `Something wrong happened. ${result.identifiers.length} users were created.`,
            );
        }

        await mailer.registerContact(email);
        const token = signer.sign({ userId: result.identifiers[0].id });
        return { token };
    }

    async function findUserByEmail(email: User['email']) {
        return userRepository.findOneBy({ email });
    }

    async function login(email: string, password: string) {
        const user = await userRepository.findOneByOrFail({ email });

        const isPasswordCorrect = hasher.verify(password, user.hashedPassword);

        if (isPasswordCorrect) {
            const token = signer.sign({ userId: user.id });
            return { token };
        } else {
            throw new Error(`The password sent does not match the hashed stored password`);
        }
    }

    async function getAllAnonymizedUsers() {
        const users = await userRepository.find();

        return mapEntities(users.map((user) => ({ ...user, email: hasher.hash(user.email) })));
    }

    async function bulkInsertUsers(users: Array<User>) {
        return userRepository.insert(users);
    }

    async function changePassword(user: User, newPassword: string) {
        const hashedPassword = hasher.hash(newPassword);
        const result = await userRepository.update({ id: user.id }, { hashedPassword });
        return result.affected === 1;
    }

    async function findPlanForUser(user: User): Promise<Plan> {
        const { plan } = await userRepository.findOneOrFail({
            where: { id: user.id },
            relations: ['plan'],
            select: ['id', 'plan'],
        });
        return plan;
    }
}
