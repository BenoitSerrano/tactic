import { dataSource } from '../../dataSource';
import { QcmAnswer } from './QcmAnswer.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildQcmAnswerService };

function buildQcmAnswerService() {
    const qcmAnswerRepository = dataSource.getRepository(QcmAnswer);

    const qcmAnswerService = {
        getAllQcmAnswers,
        bulkInsertQcmAnswers,
    };

    return qcmAnswerService;

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
