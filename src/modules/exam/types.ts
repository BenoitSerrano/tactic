import { exerciseDtoType } from '../exercise/types';
import { Exam } from './Exam.entity';

type examDtoType = Omit<Exam, 'exercises'> & { exercises: exerciseDtoType[] };

const EXAM_FILTERS = ['archived', 'current'] as const;
type examFilterType = (typeof EXAM_FILTERS)[number];

export type { examDtoType, examFilterType };
export { EXAM_FILTERS };
