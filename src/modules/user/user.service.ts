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
        getAllUsersWithoutPassword,
        bulkInsertUsers,
        changePassword,
        findPlanForUser,
        getUsersSummary,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const newUserConfiguration = await userConfigurationService.createUserConfiguration();
        const newUser = new User();
        newUser.roles = ['teacher'];
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
        const token = createJwt({ userId: result.identifiers[0].id, email, roles: newUser.roles });
        const userInfo = { email, roles: newUser.roles, plan: newUser.plan.name };
        return { token, userInfo };
    }

    function createJwt(params: { userId: User['id']; email: User['email']; roles: User['roles'] }) {
        return signer.sign(params);
    }

    async function findUserByEmail(email: User['email']) {
        return userRepository.findOneBy({ email });
    }

    async function login(email: string, password: string) {
        const user = await userRepository.findOneOrFail({ where: { email }, relations: ['plan'] });

        const isPasswordCorrect = hasher.verify(password, user.hashedPassword);

        if (isPasswordCorrect) {
            const token = createJwt({ userId: user.id, email: user.email, roles: user.roles });
            const userInfo = { email, roles: user.roles, plan: user.plan.name };

            return { token, userInfo };
        } else {
            throw new Error(`The password sent does not match the hashed stored password`);
        }
    }

    async function getAllUsersWithoutPassword() {
        const users = await userRepository.find();

        return mapEntities(users.map((user) => ({ ...user, hashedPassword: '' })));
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

    async function getUsersSummary() {
        const users = await userRepository.find({
            relations: ['plan', 'exams'],
            select: {
                id: true,
                email: true,
                roles: true,
                plan: { id: true, name: true },
                exams: { id: true },
            },
        });
        return users.map(({ id, email, roles, plan, exams }) => ({
            id,
            email,
            roles,
            plan,
            examsCount: exams.length,
        }));
    }
}
