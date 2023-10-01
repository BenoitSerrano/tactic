import { dataSource } from '../../dataSource';
import { Attempt } from '../attempt';
import { buildQuestionTrouService } from '../questionTrou';
import { QuestionTrouAnswer } from './QuestionTrouAnswer.entity';
import { questionTrouAnswersType } from './types';

export { buildQuestionTrouAnswerService };

function buildQuestionTrouAnswerService() {
    const questionTrouAnswerService = {
        updateQuestionTrouAnswers,
    };

    return questionTrouAnswerService;

    async function updateQuestionTrouAnswers(
        attempt: Attempt,
        questionTrouAnswers: questionTrouAnswersType,
    ) {
        const questionTrouService = buildQuestionTrouService();
        const questionTrouAnswerRepository = dataSource.getRepository(QuestionTrouAnswer);
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
}
