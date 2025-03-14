import { User } from './User.entity';
import { buildUserService } from './user.service';

export { buildUserController };

function buildUserController() {
    const userService = buildUserService();
    const userController = {
        createUser,
        login,
        getUsersSummary,
        getAllUsers,
        getUserRemainingPapers,
    };

    return userController;

    async function createUser(params: {
        body: { email: string; password: string; establishmentName: string; classeName: string };
    }) {
        return userService.createUser(params.body);
    }

    async function login(params: { body: { email: string; password: string } }) {
        return userService.login(params.body.email, params.body.password);
    }

    async function getUsersSummary() {
        return userService.getUsersSummary();
    }

    async function getAllUsers() {
        return userService.getAllUsersWithoutPassword();
    }

    async function getUserRemainingPapers(_params: {}, user: User) {
        return userService.getUserRemainingPapers(user);
    }
}
