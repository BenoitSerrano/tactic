import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { phraseMelangeeAnswersType, buildPhraseMelangeeService } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from './PhraseMelangeeAnswer.entity';

export { buildPhraseMelangeeAnswerService };

function buildPhraseMelangeeAnswerService() {
    const phraseMelangeeAnswerService = {
        updatePhraseMelangeeAnswers,
        getPhraseMelangeeAnswers,
    };

    return phraseMelangeeAnswerService;

    async function getPhraseMelangeeAnswers(phraseMelangeeAnswerIds: number[]) {
        const phraseMelangeeAnswerRepository = dataSource.getRepository(PhraseMelangeeAnswer);

        const phraseMelangeeAnswers = await phraseMelangeeAnswerRepository.find({
            where: { id: In(phraseMelangeeAnswerIds) },
            relations: ['phraseMelangee'],
            select: { phraseMelangee: { id: true } },
        });
        return phraseMelangeeAnswers.reduce((acc, phraseMelangeeAnswer) => {
            return { ...acc, [phraseMelangeeAnswer.id]: phraseMelangeeAnswer };
        }, {} as Record<number, PhraseMelangeeAnswer>);
    }

    async function updatePhraseMelangeeAnswers(
        attempt: Attempt,
        phraseMelangeeAnswers: phraseMelangeeAnswersType,
    ) {
        const phraseMelangeeService = buildPhraseMelangeeService();
        const phraseMelangeeAnswerRepository = dataSource.getRepository(PhraseMelangeeAnswer);
        //TODO
        const phraseMelangeeIds = Object.keys(phraseMelangeeAnswers) as unknown as number[];

        const questionsChoixMultiple = await phraseMelangeeService.getPhrasesMelangees(
            phraseMelangeeIds,
        );

        return Promise.all(
            // TODO
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
}
