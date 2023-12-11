import { questionDtoType } from '../question/types';
import { Exercise } from './Exercise.entity';

type exerciseDtoType = Omit<Exercise, 'questions'> & { questions: questionDtoType[] };

export type { exerciseDtoType };
