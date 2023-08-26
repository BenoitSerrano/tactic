import { dataSource } from '../../dataSource';
import { hasher } from '../../lib/hasher';
import { User } from './User.entity';

export { buildUserService };

function buildUserService() {
    const userService = {
        createUser,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const userRepository = dataSource.getRepository(User);

        const newUser = new User();
        newUser.email = email;
        newUser.hashedPassword = hasher.hash(password);

        const result = await userRepository.insert(newUser);
        return result.identifiers.length === 1;
    }
}
