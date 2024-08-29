import { exerciseDtoType } from '../exercise/types';
import { Exam } from './Exam.entity';

type examDtoType = Omit<Exam, 'exercises'> & { exercises: exerciseDtoType[] };

const EXAM_FILTERS = ['archived', 'current'] as const;
type examFilterType = (typeof EXAM_FILTERS)[number];

const EXAM_EDGE_TEXT_KINDS = ['start', 'end'] as const;
type examEdgeTextKind = (typeof EXAM_EDGE_TEXT_KINDS)[number];

export type { examDtoType, examFilterType, examEdgeTextKind };
export { EXAM_FILTERS };
