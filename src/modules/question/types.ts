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
type questionDtoType = Omit<Question, 'acceptableAnswers' | 'exercise'> & {
    acceptableAnswers: acceptableAnswerWithPointsType[];
};

// type questionDtoType = Omit<
//     Question,
//     'acceptableAnswersWithPoints' | 'exercise' | 'kind' | 'possibleAnswers'
// > &
//     (
//         | {
//               kind: 'texteATrous';
//               acceptableAnswersWithPoints: acceptableAnswerWithPointsType[][];
//           }
//         | {
//               kind: 'qcm';
//               possibleAnswers: string[];
//               rightAnswerIndex: number;
//           }
//         | {
//               kind: 'questionReponse' | 'phraseMelangee' | 'texteLibre';
//               possibleAnswers: string[];
//               acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
//           }
//     );

export { questionKinds };
export type { questionKindType, questionDtoType, acceptableAnswerWithPointsType };
