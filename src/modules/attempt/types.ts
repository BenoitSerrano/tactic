import { Question } from '../question';
import { Attempt } from './Attempt.entity';

type attemptAnswersType = Record<Question['id'], Attempt['answers'][number]>;

type questionAnswerStatusType = 'wrong' | 'acceptable' | 'right' | undefined;

export type { attemptAnswersType, questionAnswerStatusType };
