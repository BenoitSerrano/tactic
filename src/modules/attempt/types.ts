import { phraseMelangeeAnswersType } from '../phraseMelangee';
import { qcmChoicesType } from '../qcmAnswer';
import { questionTrouAnswersType } from '../questionTrouAnswer/types';

type attemptAnswersType = {
    qcmChoices: qcmChoicesType;
    questionTrouAnswers: questionTrouAnswersType;
    phraseMelangeeAnswers: phraseMelangeeAnswersType;
};

export type { attemptAnswersType };
