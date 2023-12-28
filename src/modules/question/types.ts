import { Question } from './Question.entity';

type gradeType = 'A' | 'B' | 'C' | 'D' | 'E';

const questionKinds = [
    'qcm',
    'questionReponse',
    'phraseMelangee',
    'texteLibre',
    'texteATrous',
] as const;
type questionKindType = (typeof questionKinds)[number];

type acceptableAnswerType = { grade: gradeType; answer: string };
type questionDtoType = Omit<Question, 'acceptableAnswers' | 'exercise'> & {
    acceptableAnswers: acceptableAnswerType[][];
};

export { questionKinds };
export type { questionKindType, questionDtoType, acceptableAnswerType, gradeType };
