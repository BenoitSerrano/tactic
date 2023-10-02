import { BaseEntity, EntityTarget, In, ObjectLiteral } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildQuestionChoixMultipleService } from '../questionChoixMultiple/questionChoixMultiple.service';
import { QcmAnswer } from './QcmAnswer.entity';
import { qcmChoicesType } from './types';

export { buildQcmAnswerService };

function buildQcmAnswerService() {
    const qcmAnswerService = {
        updateQcmChoices,
        getQcmAnswers,
    };

    return qcmAnswerService;

    async function getQcmAnswers(qcmAnswerIds: number[]) {
        const qcmAnswerRepository = dataSource.getRepository(QcmAnswer);

        const qcmAnswers = await qcmAnswerRepository.find({
            where: { id: In(qcmAnswerIds) },
            relations: ['questionChoixMultiple'],
            select: { questionChoixMultiple: { id: true } },
        });
        return qcmAnswers.reduce((acc, qcmAnswer) => {
            return { ...acc, [qcmAnswer.id]: qcmAnswer };
        }, {} as Record<number, QcmAnswer>);
    }

    async function updateQcmChoices(attempt: Attempt, qcmAnswers: qcmChoicesType) {
        const questionChoixMultipleService = buildQuestionChoixMultipleService();
        const qcmAnswerRepository = dataSource.getRepository(QcmAnswer);
        // TODO
        const qcmIds = Object.keys(qcmAnswers) as unknown as number[];

        const questionsChoixMultiple =
            await questionChoixMultipleService.getQuestionsChoixMultiples(qcmIds);

        return Promise.all(
            // TODO
            Object.keys(qcmAnswers).map((qcmId: any) => {
                const choice = qcmAnswers[qcmId];
                const questionChoixMultiple = questionsChoixMultiple[qcmId];
                return qcmAnswerRepository.upsert({ attempt, questionChoixMultiple, choice }, [
                    'questionChoixMultiple',
                    'attempt',
                ]);
            }),
        );
    }
}
