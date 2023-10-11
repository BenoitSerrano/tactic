import { dataSource } from '../../dataSource';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildQuestionTrouAnswerService };

function buildQuestionTrouAnswerService() {
    const questionTrouAnswerRepository = dataSource.getRepository(QuestionTrouAnswer);

    const questionTrouAnswerService = {
        getAllQuestionTrouAnswers,
        bulkInsertQuestionTrouAnswers,
    };

    return questionTrouAnswerService;

    async function getAllQuestionTrouAnswers() {
        const questionsTrouAnswers = await questionTrouAnswerRepository.find({
            relations: ['attempt', 'questionTrou'],
            select: { attempt: { id: true }, questionTrou: { id: true } },
        });

        return mapEntities(questionsTrouAnswers);
    }

    async function bulkInsertQuestionTrouAnswers(questionTrouAnswers: Array<QuestionTrouAnswer>) {
        return questionTrouAnswerRepository.insert(questionTrouAnswers);
    }
}
