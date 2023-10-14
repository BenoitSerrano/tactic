import { dataSource } from '../../dataSource';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { mapEntities } from '../../lib/mapEntities';

export { buildQuestionChoixMultipleService };

function buildQuestionChoixMultipleService() {
    const questionChoixMultipleRepository = dataSource.getRepository(QuestionChoixMultiple);
    const questionChoixMultipleService = {
        getAllQuestionsChoixMultiples,
        bulkInsertQcm,
    };

    return questionChoixMultipleService;

    async function getAllQuestionsChoixMultiples() {
        const questionsChoixMultiple = await questionChoixMultipleRepository.find({
            relations: ['exam'],
            select: { exam: { id: true } },
        });
        return mapEntities(questionsChoixMultiple);
    }

    async function bulkInsertQcm(questionsChoixMultiple: Array<QuestionChoixMultiple>) {
        return questionChoixMultipleRepository.insert(questionsChoixMultiple);
    }
}
