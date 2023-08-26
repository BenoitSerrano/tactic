import { buildUserService } from './user.service';

export { buildUserController };

function buildUserController() {
    const userService = buildUserService();
    const userController = {
        createUser,
    };

    return userController;

    async function createUser(params: { body: { email: string; password: string } }) {
        return userService.createUser(params.body.email, params.body.password);
    }
}
