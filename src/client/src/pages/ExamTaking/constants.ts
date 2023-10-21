import { questionKindType } from '../../types';
import { ElementType } from 'react';
import { QuestionChoixMultipleAnswering } from './QuestionChoixMultipleAnswering';
import { QuestionTrouAnswering } from './QuestionTrouAnswering';
import { PhraseMelangeeAnswering } from './PhraseMelangeeAnswering';
import { TexteLibreAnswering } from './TexteLibreAnswering';

const questionSpecicityMapping: Record<
    questionKindType,
    {
        QuestionAnsweringComponent: ElementType;
    }
> = {
    qcm: {
        QuestionAnsweringComponent: QuestionChoixMultipleAnswering,
    },
    questionTrou: {
        QuestionAnsweringComponent: QuestionTrouAnswering,
    },
    phraseMelangee: {
        QuestionAnsweringComponent: PhraseMelangeeAnswering,
    },
    texteLibre: {
        QuestionAnsweringComponent: TexteLibreAnswering,
    },
};

export { questionSpecicityMapping };
