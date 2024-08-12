import { ElementType } from 'react';
import { QCMUpsertionModalContent } from './QuestionUpsertionModal/QCMUpsertionModalContent';
import { QuestionReponseUpsertionModalContent } from './QuestionUpsertionModal/QuestionReponseUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './QuestionUpsertionModal/PhraseMelangeeUpsertionModalContent';
import { TexteLibreUpsertionModalContent } from './QuestionUpsertionModal/TexteLibreUpsertionModalContent';
import { TexteATrousUpsertionModalContent } from './QuestionUpsertionModal/TexteATrousUpsertionModalContent';
import { questionKindType } from '../../../types';
import { QcmPreviewing } from './QuestionPreviewing/QcmPreviewing';
import { TexteLibrePreviewing } from './QuestionPreviewing/TexteLibrePreviewing';
import { QuestionReponsePreviewing } from './QuestionPreviewing/QuestionReponsePreviewing';
import { PhraseMelangeePreviewing } from './QuestionPreviewing/PhraseMelangeePreviewing';
import { TexteATrousPreviewing } from './QuestionPreviewing/TexteATrous';

const questionUpsertionModalContentComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QCMUpsertionModalContent,
    questionReponse: QuestionReponseUpsertionModalContent,
    phraseMelangee: PhraseMelangeeUpsertionModalContent,
    texteLibre: TexteLibreUpsertionModalContent,
    texteATrous: TexteATrousUpsertionModalContent,
};

const questionPreviewingComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QcmPreviewing,
    questionReponse: QuestionReponsePreviewing,
    phraseMelangee: PhraseMelangeePreviewing,
    texteLibre: TexteLibrePreviewing,
    texteATrous: TexteATrousPreviewing,
};

const SPLITTING_CHARACTER_FOR_ANSWERS = ';';

export {
    questionUpsertionModalContentComponentMapping,
    questionPreviewingComponentMapping,
    SPLITTING_CHARACTER_FOR_ANSWERS,
};
