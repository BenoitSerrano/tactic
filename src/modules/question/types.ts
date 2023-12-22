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
    acceptableAnswers: acceptableAnswerType[];
};

// type questionDtoType = Omit<
//     Question,
//     'acceptableAnswersWithPoints' | 'exercise' | 'kind' | 'possibleAnswers'
// > &
//     (
//         | {
//               kind: 'texteATrous';
//               acceptableAnswersWithPoints: acceptableAnswerType[][];
//           }
//         | {
//               kind: 'qcm';
//               possibleAnswers: string[];
//               rightAnswerIndex: number;
//           }
//         | {
//               kind: 'questionReponse' | 'phraseMelangee' | 'texteLibre';
//               possibleAnswers: string[];
//               acceptableAnswersWithPoints: acceptableAnswerType[];
//           }
//     );

export { questionKinds };
export type { questionKindType, questionDtoType, acceptableAnswerType, gradeType };
