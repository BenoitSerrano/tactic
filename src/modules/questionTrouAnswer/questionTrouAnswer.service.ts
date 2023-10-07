import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildQuestionTrouService } from '../questionTrou';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';
import { questionTrouAnswersType } from './types';
import { mapEntities } from '../../lib/mapEntities';

export { buildQuestionTrouAnswerService };

function buildQuestionTrouAnswerService() {
    const questionTrouAnswerRepository = dataSource.getRepository(QuestionTrouAnswer);

    const questionTrouAnswerService = {
        getQuestionTrouAnswers,
        updateQuestionTrouAnswers,
        getAllQuestionTrouAnswers,
        bulkInsertQuestionTrouAnswers,
    };

    return questionTrouAnswerService;

    async function getQuestionTrouAnswers(questionTrouAnswerIds: number[]) {
        const questionTrouAnswers = await questionTrouAnswerRepository.find({
            where: { id: In(questionTrouAnswerIds) },
            relations: ['questionTrou'],
            select: { questionTrou: { id: true } },
        });
        return mapEntities(questionTrouAnswers);
    }

    async function updateQuestionTrouAnswers(
        attempt: Attempt,
        questionTrouAnswers: questionTrouAnswersType,
    ) {
        const questionTrouService = buildQuestionTrouService();
        //TODO
        const questionTrouIds = Object.keys(questionTrouAnswers) as unknown as number[];

        const questionsChoixMultiple = await questionTrouService.getQuestionsTrou(questionTrouIds);

        return Promise.all(
            // TODO
            Object.keys(questionTrouAnswers).map((questionTrouId: any) => {
                const answer = questionTrouAnswers[questionTrouId];
                const questionTrou = questionsChoixMultiple[questionTrouId];
                return questionTrouAnswerRepository.upsert({ attempt, questionTrou, answer }, [
                    'questionTrou',
                    'attempt',
                ]);
            }),
        );
    }

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
