import { dataSource } from '../dataSource';
import { Exam } from '../modules/exam';
import { User } from '../modules/user';

function hasAccessToResources(resources: Array<{ entity: 'exam'; key: string }>) {
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
                    if (exam.user?.id !== user.id) {
                        throw new Error(
                            `exam.user.id "${exam.user?.id}" does not match user.id ${user.id}`,
                        );
                    }
            }
        }
    };
}

function isLoggedIn() {
    return () => {};
}

const accessControlBuilder = {
    hasAccessToResources,
    isLoggedIn,
};

export { accessControlBuilder };
