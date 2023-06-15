import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { QcmAnswer } from './QcmAnswer.entity';

export { buildQcmAnswerService };

function buildQcmAnswerService() {
    const qcmAnswerService = {
        createOrUpdateQcmAnswer,
    };

    return qcmAnswerService;

    async function createOrUpdateQcmAnswer(attemptId: string, qcmId: number, choice: number) {
        const questionChoixMultipleRepository = dataSource.getRepository(QuestionChoixMultiple);
        const attemptRepository = dataSource.getRepository(Attempt);
        const qcmAnswerRepository = dataSource.getRepository(QcmAnswer);

        const attempt = await attemptRepository.findOneByOrFail({ id: attemptId });
        const questionChoixMultiple = await questionChoixMultipleRepository.findOneByOrFail({
            id: qcmId,
        });

        return qcmAnswerRepository.upsert({ attempt, questionChoixMultiple, choice }, [
            'questionChoixMultiple',
            'attempt',
        ]);
    }
}
