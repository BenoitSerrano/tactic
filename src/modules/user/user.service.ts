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
        getUsersSummary,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const newUserConfiguration = await userConfigurationService.createUserConfiguration();
        const newUser = new User();
        newUser.role = 'teacher';
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
        const token = createJwt({ userId: result.identifiers[0].id, email, role: newUser.role });
        return { token };
    }

    function createJwt(params: { userId: User['id']; email: User['email']; role: User['role'] }) {
        return signer.sign(params);
    }

    async function findUserByEmail(email: User['email']) {
        return userRepository.findOneBy({ email });
    }

    async function login(email: string, password: string) {
        const user = await userRepository.findOneByOrFail({ email });

        const isPasswordCorrect = hasher.verify(password, user.hashedPassword);

        if (isPasswordCorrect) {
            const token = createJwt({ userId: user.id, email: user.email, role: user.role });
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

    async function getUsersSummary() {
        const users = await userRepository.find({
            relations: ['plan', 'exams'],
            select: {
                id: true,
                email: true,
                role: true,
                plan: { id: true, name: true },
                exams: { id: true },
            },
        });
        return users.map(({ id, email, role, plan, exams }) => ({
            id,
            email,
            role,
            plan,
            examsCount: exams.length,
        }));
    }
}
