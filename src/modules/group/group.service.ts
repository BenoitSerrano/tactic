import { dataSource } from '../../dataSource';
import { Group } from './Group.entity';
import { User } from '../user';

export { buildGroupService };

function buildGroupService() {
    const groupRepository = dataSource.getRepository(Group);

    const groupService = {
        getAllGroups,
        fetchGroups,
        getGroup,
        createGroup,
        deleteGroup,
    };

    return groupService;

    async function getAllGroups() {
        const groups = await groupRepository.find({});

        return groups;
    }

    async function fetchGroups(user: User) {
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

    async function createGroup(criteria: { user: User }, params: { name: Group['name'] }) {
        const { user } = criteria;

        await groupRepository.insert({ user, name: params.name });
        return true;
    }

    async function deleteGroup(criteria: { groupId: Group['id'] }) {
        const result = await groupRepository.delete({ id: criteria.groupId });
        return result.affected == 1;
    }
}
