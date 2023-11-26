import { User } from '../user';
import { buildGroupService } from './group.service';

export { buildGroupController };

function buildGroupController() {
    const groupService = buildGroupService();
    const groupController = {
        fetchGroups,
        createGroup,
    };

    return groupController;

    async function fetchGroups(_params: {}, user?: User) {
        return groupService.fetchGroups(user);
    }

    async function createGroup(params: { body: { name: string } }, user?: User) {
        return groupService.createGroup({ user }, { name: params.body.name });
    }
}
