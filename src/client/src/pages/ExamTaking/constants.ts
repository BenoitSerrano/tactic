import { questionKindType } from '../../types';
import { ElementType } from 'react';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { TexteLibreAnswering } from './TexteLibreAnswering';
import { TexteATrousAnswering } from './TexteATrousAnswering';

const questionAnsweringComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QuestionChoixMultipleAnswering,
    questionTrou: QuestionTrouAnswering,
    phraseMelangee: PhraseMelangeeAnswering,
    texteLibre: TexteLibreAnswering,
    texteATrous: TexteATrousAnswering,
};

export { questionAnsweringComponentMapping };
