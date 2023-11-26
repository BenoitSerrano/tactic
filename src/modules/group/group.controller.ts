import { User } from '../user';
import { buildGroupService } from './group.service';

export { buildGroupController };

function buildGroupController() {
    const groupService = buildGroupService();
    const groupController = {
        fetchGroups,
    };

    return groupController;

    async function fetchGroups(_params: {}, user?: User) {
        return groupService.fetchGroups(user);
    }
}
