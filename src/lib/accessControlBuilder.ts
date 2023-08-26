import { dataSource } from '../dataSource';
import { Exam } from '../modules/exam';
import { Student } from '../modules/student';
import { User } from '../modules/user';

function hasAccessToResources(resources: Array<{ entity: 'exam' | 'student'; key: string }>) {
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
                    break;
                case 'student':
                    const studentId = params[key];
                    const studentRepository = dataSource.getRepository(Student);
                    const student = await studentRepository.findOneOrFail({
                        where: { id: studentId },
                        relations: ['user'],
                    });
                    if (student.user?.id !== user.id) {
                        throw new Error(
                            `student.user.id "${student.user?.id}" does not match user.id ${user.id}`,
                        );
                    }
                    break;
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
