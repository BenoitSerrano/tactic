import { Question } from '../question';
import { Attempt } from './Attempt.entity';

type attemptAnswersType = Record<Question['id'], Attempt['answers'][number]>;

type questionAnswerStatusType = 'wrong' | 'acceptable' | 'right' | undefined;

type questionAnswerSummaryType = Record<
    Question['id'],
    {
        answer: Attempt['answers'][number];
        status: questionAnswerStatusType;
        points: Question['points'];
    }
>;

export type { attemptAnswersType, questionAnswerStatusType, questionAnswerSummaryType };
