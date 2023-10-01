import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildQuestionChoixMultipleService } from '../questionChoixMultiple/questionChoixMultiple.service';
import { QcmAnswer } from './QcmAnswer.entity';
import { qcmChoicesType } from './types';

export { buildQcmAnswerService };

function buildQcmAnswerService() {
    const qcmAnswerService = {
        updateQcmChoices,
    };

    return qcmAnswerService;

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
