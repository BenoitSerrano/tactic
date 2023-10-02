import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { PhraseMelangee } from './PhraseMelangee.entity';

export { buildPhraseMelangeeService };

function buildPhraseMelangeeService() {
    const phraseMelangeeRepository = dataSource.getRepository(PhraseMelangee);
    const phraseMelangeeService = {
        createPhraseMelangee,
        updatePhraseMelangee,
        getPhrasesMelangees,
    };

    return phraseMelangeeService;

    async function createPhraseMelangee(
        examId: string,
        {
            shuffledPhrase,
            correctPhrases,
            words,
            points,
        }: {
            words: string[];
            shuffledPhrase: string;
            correctPhrases: string[];
            points: number;
        },
    ) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const phraseMelangee = new PhraseMelangee();
        const highestOrder = await getHighestPhraseMelangeeOrder(examId);

        phraseMelangee.words = words;
        phraseMelangee.correctPhrases = correctPhrases;
        phraseMelangee.shuffledPhrase = shuffledPhrase;
        phraseMelangee.points = points;
        phraseMelangee.exam = exam;
        phraseMelangee.order = highestOrder + 1;
        return phraseMelangeeRepository.save(phraseMelangee);
    }

    async function getHighestPhraseMelangeeOrder(examId: string) {
        const questionsTrou = await phraseMelangeeRepository.find({
            where: { exam: { id: examId } },
            select: { order: true, id: true },
            order: { order: 'DESC' },
            take: 1,
        });

        if (questionsTrou.length == 0) {
            return -1;
        }
        return questionsTrou[0].order;
    }

    async function updatePhraseMelangee({
        examId,
        phraseMelangeeId,
        shuffledPhrase,
        correctPhrases,
        words,
        points,
    }: {
        examId: string;
        phraseMelangeeId: number;
        words: string[];
        shuffledPhrase: string;
        correctPhrases: string[];
        points: number;
    }) {
        const phraseMelangee = await phraseMelangeeRepository.findOneOrFail({
            where: { exam: { id: examId }, id: phraseMelangeeId },
        });

        phraseMelangee.words = words;
        phraseMelangee.shuffledPhrase = shuffledPhrase;
        phraseMelangee.correctPhrases = correctPhrases;
        phraseMelangee.points = points;

        return phraseMelangeeRepository.save(phraseMelangee);
    }

    async function getPhrasesMelangees(phraseMelangeeIds: number[]) {
        const phrasesMelangees = await phraseMelangeeRepository.find({
            where: { id: In(phraseMelangeeIds) },
        });
        return phrasesMelangees.reduce((acc, phraseMelangee) => {
            return { ...acc, [phraseMelangee.id]: phraseMelangee };
        }, {} as Record<number, PhraseMelangee>);
    }
}
