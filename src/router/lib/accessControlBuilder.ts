import { dataSource } from '../../dataSource';
import { Exam } from '../../modules/exam';
import { Group } from '../../modules/group';
import { User } from '../../modules/user';

function hasAccessToResources(resources: Array<{ entity: 'exam' | 'group'; key: string }>) {
    return async (params: Record<string, string>, user: User) => {
        for (const resource of resources) {
            const { entity, key } = resource;
            switch (entity) {
                case 'exam':
                    const examId = params[key];
                    const examRepository = dataSource.getRepository(Exam);
                    const exam = await examRepository.findOneOrFail({
                        where: { id: examId },
                        relations: ['user'],
                    });
                    if (exam.user.id !== user.id) {
                        throw new Error(
                            `exam.user.id "${exam.user.id}" does not match user.id ${user.id}`,
                        );
                    }
                    break;
                case 'group':
                    const groupId = params[key];
                    const groupRepository = dataSource.getRepository(Group);
                    const group = await groupRepository.findOneOrFail({
                        where: { id: groupId },
                        relations: ['user'],
                    });
                    if (group.user.id !== user.id) {
                        throw new Error(
                            `group.user.id "${group.user.id}" does not match user.id ${user.id}`,
                        );
                    }
                    break;
            }
        }
    };
}

const accessControlBuilder = {
    hasAccessToResources,
};

export { accessControlBuilder };
