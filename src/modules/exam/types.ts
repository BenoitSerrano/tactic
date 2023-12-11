import { exerciseDtoType } from '../exercise/types';
import { Exam } from './Exam.entity';

type examDtoType = Omit<Exam, 'exercises'> & { exercises: exerciseDtoType[] };

export type { examDtoType };
