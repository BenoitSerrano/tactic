import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { phraseMelangeeAnswersType, buildPhraseMelangeeService } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildPhraseMelangeeAnswerService };

function buildPhraseMelangeeAnswerService() {
    const phraseMelangeeAnswerRepository = dataSource.getRepository(PhraseMelangeeAnswer);

    const phraseMelangeeAnswerService = {
        updatePhraseMelangeeAnswers,
        getPhraseMelangeeAnswers,
        getAllPhraseMelangeeAnswers,
        bulkInsertPhraseMelangeeAnswers,
    };

    return phraseMelangeeAnswerService;

    async function getPhraseMelangeeAnswers(phraseMelangeeAnswerIds: number[]) {
        const phraseMelangeeAnswers = await phraseMelangeeAnswerRepository.find({
            where: { id: In(phraseMelangeeAnswerIds) },
            relations: ['phraseMelangee'],
            select: { phraseMelangee: { id: true } },
        });
        return mapEntities(phraseMelangeeAnswers);
    }

    async function updatePhraseMelangeeAnswers(
        attempt: Attempt,
        phraseMelangeeAnswers: phraseMelangeeAnswersType,
    ) {
        const phraseMelangeeService = buildPhraseMelangeeService();
        // TODO type
        const phraseMelangeeIds = Object.keys(phraseMelangeeAnswers) as unknown as number[];

        const questionsChoixMultiple = await phraseMelangeeService.getPhrasesMelangees(
            phraseMelangeeIds,
        );

        return Promise.all(
            // TODO type
            Object.keys(phraseMelangeeAnswers).map((phraseMelangeeId: any) => {
                const answer = phraseMelangeeAnswers[phraseMelangeeId];
                const phraseMelangee = questionsChoixMultiple[phraseMelangeeId];
                return phraseMelangeeAnswerRepository.upsert({ attempt, phraseMelangee, answer }, [
                    'phraseMelangee',
                    'attempt',
                ]);
            }),
        );
    }

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
