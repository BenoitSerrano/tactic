import { questionKindType } from '../../types';
import { ElementType } from 'react';
import { QCMUpsertionModalContent } from './QCMUpsertionModalContent';
import { QuestionTrouUpsertionModalContent } from './QuestionTrouUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './PhraseMelangeeUpsertionModalContent';
import { TexteLibreUpsertionModalContent } from './TexteLibreUpsertionModalContent';
import { TexteATrousUpsertionModalContent } from './TexteATrousUpsertionModalContent';

const questionUpsertionModalContentComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QCMUpsertionModalContent,
    questionTrou: QuestionTrouUpsertionModalContent,
    phraseMelangee: PhraseMelangeeUpsertionModalContent,
    texteLibre: TexteLibreUpsertionModalContent,
    texteATrous: TexteATrousUpsertionModalContent,
};

const SPLITTING_CHARACTER_FOR_ANSWERS = ';';

export { questionUpsertionModalContentComponentMapping, SPLITTING_CHARACTER_FOR_ANSWERS };
