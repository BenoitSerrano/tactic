import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildAttemptService } from '../attempt/attempt.service';
import { PhraseMelangee } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';

export { buildPhraseMelangeeAnswerService };

function buildPhraseMelangeeAnswerService() {
    const phraseMelangeeAnswerService = {
        createOrUpdatePhraseMelangeeAnswer,
    };

    return phraseMelangeeAnswerService;

    async function createOrUpdatePhraseMelangeeAnswer(
        attemptId: string,
        phraseMelangeeId: number,
        combination: number[],
    ) {
        const phraseMelangeeRepository = dataSource.getRepository(PhraseMelangee);
        const attemptRepository = dataSource.getRepository(Attempt);
        const phraseMelangeeAnswerRepository = dataSource.getRepository(PhraseMelangeeAnswer);
        const attemptService = buildAttemptService();

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            relations: ['exam'],
        });

        await attemptService.assertIsTimeLimitNotExceeded(attempt);
        await attemptService.updateAttemptDuration(attempt.id);

        const phraseMelangee = await phraseMelangeeRepository.findOneByOrFail({
            id: phraseMelangeeId,
        });

        if (phraseMelangee.words.length !== combination.length) {
            throw new Error(`The length between words and shuffledCombination are not compatible.`);
        }

        return phraseMelangeeAnswerRepository.upsert(
            { attempt, phraseMelangee, combination: combination.map((value) => `${value}`) },
            ['phraseMelangee', 'attempt'],
        );
    }
}