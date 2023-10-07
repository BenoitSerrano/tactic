import { BaseEntity, EntityTarget, In, ObjectLiteral } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildQuestionChoixMultipleService } from '../questionChoixMultiple/questionChoixMultiple.service';
import { QcmAnswer } from './QcmAnswer.entity';
import { qcmChoicesType } from './types';
import { mapEntities } from '../../lib/mapEntities';

export { buildQcmAnswerService };

function buildQcmAnswerService() {
    const qcmAnswerRepository = dataSource.getRepository(QcmAnswer);

    const qcmAnswerService = {
        updateQcmChoices,
        getQcmAnswers,
        getAllQcmAnswers,
        bulkInsertQcmAnswers,
    };

    return qcmAnswerService;

    async function getQcmAnswers(qcmAnswerIds: number[]) {
        const qcmAnswers = await qcmAnswerRepository.find({
            where: { id: In(qcmAnswerIds) },
            relations: ['questionChoixMultiple'],
            select: { questionChoixMultiple: { id: true } },
        });
        return mapEntities(qcmAnswers);
    }

    async function updateQcmChoices(attempt: Attempt, qcmAnswers: qcmChoicesType) {
        const questionChoixMultipleService = buildQuestionChoixMultipleService();
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

    async function getAllQcmAnswers() {
        const qcmAnswers = await qcmAnswerRepository.find({
            relations: ['attempt', 'questionChoixMultiple'],
            select: { attempt: { id: true }, questionChoixMultiple: { id: true } },
        });

        return mapEntities(qcmAnswers);
    }

    async function bulkInsertQcmAnswers(qcmAnswers: Array<QcmAnswer>) {
        return qcmAnswerRepository.insert(qcmAnswers);
    }
}
