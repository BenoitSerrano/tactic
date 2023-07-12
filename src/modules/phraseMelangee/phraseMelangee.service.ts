import { dataSource } from '../../dataSource';
import { buildExamService } from '../exam/exam.service';
import { PhraseMelangee } from './PhraseMelangee.entity';

export { buildPhraseMelangeeService };

function buildPhraseMelangeeService() {
    const phraseMelangeeRepository = dataSource.getRepository(PhraseMelangee);
    const phraseMelangeeService = {
        createPhraseMelangee,
        updatePhraseMelangee,
    };

    return phraseMelangeeService;

    async function createPhraseMelangee(examId: string) {
        const examService = buildExamService();
        const exam = await examService.getExam(examId);

        const phraseMelangee = new PhraseMelangee();
        const highestOrder = await getHighestPhraseMelangeeOrder(examId);

        phraseMelangee.words = [];
        phraseMelangee.shuffledCombination = [];
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
        shuffledCombination,
        words,
    }: {
        examId?: string;
        phraseMelangeeId?: number;
        words?: string[];
        shuffledCombination?: number[];
    }) {
        const phraseMelangee = await phraseMelangeeRepository.findOneOrFail({
            where: { exam: { id: examId }, id: phraseMelangeeId },
        });

        if (
            (words ? words.length : phraseMelangee.words.length) !==
            (shuffledCombination
                ? shuffledCombination.length
                : phraseMelangee.shuffledCombination.length)
        ) {
            throw new Error(`The length between words and shuffledCombination are not compatible.`);
        }

        if (shuffledCombination !== undefined) {
            phraseMelangee.shuffledCombination = shuffledCombination.map((value) => `${value}`);
        }

        if (words !== undefined) {
            phraseMelangee.words = words;
        }

        return phraseMelangeeRepository.save(phraseMelangee);
    }
}
