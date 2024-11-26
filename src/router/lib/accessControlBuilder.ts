import { dataSource } from '../../dataSource';
import { Exam } from '../../modules/exam';
import { Classe } from '../../modules/classe';
import { User } from '../../modules/user';
import { Establishment } from '../../modules/establishment';

function assertHasAccessToResources(
    resources: Array<{ entity: 'exam' | 'classe' | 'establishment'; key: string }>,
) {
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
                case 'classe':
                    const classeId = params[key];
                    const classeRepository = dataSource.getRepository(Classe);
                    const classe = await classeRepository.findOneOrFail({
                        where: { id: classeId },
                        relations: ['user'],
                    });
                    //  TODO
                    // if (classe.user.id !== user.id) {
                    //     throw new Error(
                    //         `classe.user.id "${classe.user.id}" does not match user.id ${user.id}`,
                    //     );
                    // }
                    break;
                case 'establishment':
                    const establishmentId = params[key];
                    const establishmentRepository = dataSource.getRepository(Establishment);
                    const establishment = await establishmentRepository.findOneOrFail({
                        where: { id: establishmentId },
                        relations: ['user'],
                        select: { id: true, user: { id: true } },
                    });
                    if (establishment.user.id !== user.id) {
                        throw new Error(
                            `establishment.user.id "${establishment.user.id}" does not match user.id ${user.id}`,
                        );
                    }
                    break;
            }
        }
    };
}

const accessControlBuilder = {
    assertHasAccessToResources,
};

export { accessControlBuilder };
