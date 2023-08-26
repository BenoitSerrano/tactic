import { dataSource } from '../../dataSource';
import { hasher } from '../../lib/hasher';
import { signer } from '../../lib/signer';
import { User } from './User.entity';

export { buildUserService };

function buildUserService() {
    const userRepository = dataSource.getRepository(User);

    const userService = {
        createUser,
        login,
    };

    return userService;

    async function createUser(email: string, password: string) {
        const newUser = new User();
        newUser.email = email;
        newUser.hashedPassword = hasher.hash(password);

        const result = await userRepository.insert(newUser);
        return result.identifiers.length === 1;
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
}
