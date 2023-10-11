import { dataSource } from '../../dataSource';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildPhraseMelangeeAnswerService };

function buildPhraseMelangeeAnswerService() {
    const phraseMelangeeAnswerRepository = dataSource.getRepository(PhraseMelangeeAnswer);

    const phraseMelangeeAnswerService = {
        getAllPhraseMelangeeAnswers,
        bulkInsertPhraseMelangeeAnswers,
    };

    return phraseMelangeeAnswerService;

    async function getAllPhraseMelangeeAnswers() {
        const phraseMelangeeAnswers = await phraseMelangeeAnswerRepository.find({
            relations: ['attempt', 'phraseMelangee'],
            select: { attempt: { id: true }, phraseMelangee: { id: true } },
        });

        return mapEntities(phraseMelangeeAnswers);
    }

    async function bulkInsertPhraseMelangeeAnswers(
        phraseMelangeeAnswers: Array<PhraseMelangeeAnswer>,
    ) {
        return phraseMelangeeAnswerRepository.insert(phraseMelangeeAnswers);
    }
}
