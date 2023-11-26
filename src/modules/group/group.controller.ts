import { User } from '../user';
import { buildGroupService } from './group.service';

export { buildGroupController };

function buildGroupController() {
    const groupService = buildGroupService();
    const groupController = {
        getGroups,
    };

    return groupController;

    async function getGroups(_params: {}, user?: User) {
        return groupService.getGroups(user);
    }
}
