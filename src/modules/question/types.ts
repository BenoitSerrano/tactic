import { Question } from './Question.entity';

const questionKinds = [
    'qcm',
    'questionReponse',
    'phraseMelangee',
    'texteLibre',
    'texteATrous',
] as const;
type questionKindType = (typeof questionKinds)[number];

type acceptableAnswerWithPointsType = { points: number; answer: string };

type questionDtoType = Omit<Question, 'acceptableAnswersWithPoints' | 'exercise'> & {
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
};

export { questionKinds };
export type { questionKindType, questionDtoType, acceptableAnswerWithPointsType };
