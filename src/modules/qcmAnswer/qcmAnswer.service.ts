import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildAttemptService } from '../attempt/attempt.service';
import { attemptUtils } from '../attempt/attempt.utils';
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
        const attemptService = buildAttemptService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            relations: ['exam'],
        });

        await attemptService.assertIsTimeLimitNotExceeded(attempt);

        const questionChoixMultiple = await questionChoixMultipleRepository.findOneByOrFail({
            id: qcmId,
        });

        return qcmAnswerRepository.upsert({ attempt, questionChoixMultiple, choice }, [
            'questionChoixMultiple',
            'attempt',
        ]);
    }
}
