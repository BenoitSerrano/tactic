import { dataSource } from '../../dataSource';
import { Exam, buildExamService } from '../../modules/exam';
import { Classe } from '../../modules/classe';
import { User, buildUserService } from '../../modules/user';

function assertHasRightPlanForCreation(entity: 'exam') {
    const userService = buildUserService();
    return async (params: Record<string, string>, user: User) => {
        const plan = await userService.findPlanForUser(user);
        switch (entity) {
            case 'exam':
                if (plan.maxExams === null || plan.maxExams === undefined) {
                    return;
                }

                const examService = buildExamService();
                const examCount = await examService.countExamsForUser(user);
                if (examCount < plan.maxExams) {
                    return;
                }
                throw new Error(
                    `Votre formule actuelle ("${plan.name}") ne vous permet pas de créer un examen supplémentaire. Veuillez écrire à benoit.serrano10@gmail.com pour passer au plan PRO ou UNLIMITED.`,
                );
        }
    };
}

function assertHasAccessToResources(resources: Array<{ entity: 'exam' | 'classe'; key: string }>) {
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
            }
        }
    };
}

const accessControlBuilder = {
    assertHasAccessToResources,
    assertHasRightPlanForCreation,
};

export { accessControlBuilder };
