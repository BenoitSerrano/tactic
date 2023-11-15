import { questionKindType } from '../../types';
import { ElementType } from 'react';
import { QuestionChoixMultipleAnswering } from './components/QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './components/QuestionTrouAnswering';
import { PhraseMelangeeAnswering } from './components/PhraseMelangeeAnswering';
import { TexteLibreAnswering } from './components/TexteLibreAnswering';
import { TexteATrousAnswering } from './components/TexteATrousAnswering';

const questionAnsweringComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QuestionChoixMultipleAnswering,
    questionTrou: QuestionTrouAnswering,
    phraseMelangee: PhraseMelangeeAnswering,
    texteLibre: TexteLibreAnswering,
    texteATrous: TexteATrousAnswering,
};

export { questionAnsweringComponentMapping };
