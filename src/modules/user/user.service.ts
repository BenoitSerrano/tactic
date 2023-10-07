import { dataSource } from '../../dataSource';
import { hasher } from '../../lib/hasher';
import { mapEntities } from '../../lib/mapEntities';
import { signer } from '../../lib/signer';
import { User } from './User.entity';

export { buildUserService };

function buildUserService() {
    const userRepository = dataSource.getRepository(User);

    const userService = {
        createUser,
        login,
        getAllAnonymizedUsers,
        bulkInsertUsers,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const newUser = new User();
        newUser.email = email;
        newUser.hashedPassword = hasher.hash(password);

        const result = await userRepository.insert(newUser);
        if (result.identifiers.length !== 1) {
            throw new Error(
                `Something wrong happened. ${result.identifiers.length} users were created.`,
            );
        }
        const token = signer.sign({ userId: result.identifiers[0].id });
        return { token };
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
}
