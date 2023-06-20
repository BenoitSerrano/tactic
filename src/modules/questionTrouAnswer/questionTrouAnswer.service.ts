import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildAttemptService } from '../attempt/attempt.service';
import { QuestionTrou } from '../questionTrou';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';

export { buildQuestionTrouAnswerService };

function buildQuestionTrouAnswerService() {
    const questionTrouAnswerService = {
        createOrUpdateQuestionTrouAnswer,
    };

    return questionTrouAnswerService;

    async function createOrUpdateQuestionTrouAnswer(
        attemptId: string,
        questionTrouId: number,
        answer: string,
    ) {
        const questionTrouRepository = dataSource.getRepository(QuestionTrou);
        const attemptRepository = dataSource.getRepository(Attempt);
        const questionTrouAnswerRepository = dataSource.getRepository(QuestionTrouAnswer);
        const attemptService = buildAttemptService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            relations: ['exam'],
        });

        await attemptService.assertIsTimeLimitNotExceeded(attempt);

        const questionTrou = await questionTrouRepository.findOneByOrFail({
            id: questionTrouId,
        });

        return questionTrouAnswerRepository.upsert({ attempt, questionTrou, answer }, [
            'questionTrou',
            'attempt',
        ]);
    }
}
