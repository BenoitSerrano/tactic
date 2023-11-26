import { dataSource } from '../../dataSource';
import { Group } from './Group.entity';
import { User } from '../user';

export { buildGroupService };

function buildGroupService() {
    const groupRepository = dataSource.getRepository(Group);

    const groupService = {
        getGroups,
        getGroup,
    };

    return groupService;

    async function getGroups(user: User | undefined) {
        if (!user) {
            return [];
        }
        const groups = await groupRepository.find({
            where: { user: { id: user.id } },
        });
        return groups;
    }

    async function getGroup(groupId: Group['id']) {
        const group = await groupRepository.findOneOrFail({
            where: { id: groupId },
        });
        return group;
    }
}
