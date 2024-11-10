import { exerciseDtoType } from '../exercise/types';
import { Exam } from './Exam.entity';

type examDtoType = Omit<Exam, 'exercises'> & { exercises: exerciseDtoType[] };

const EXAM_EDGE_TEXT_KINDS = ['start', 'end'] as const;
type examEdgeTextKind = (typeof EXAM_EDGE_TEXT_KINDS)[number];

export type { examDtoType, examEdgeTextKind };
