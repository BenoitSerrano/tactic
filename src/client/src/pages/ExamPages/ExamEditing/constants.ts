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

const CANNOT_EDIT_POINTS_TOOLTIP_TEXT =
    "Vous ne pouvez pas éditer le nombre de points pour cette question. Pour modifier individuellement le nombre de points, il vous faut modifier la valeur dans la modale d'édition de l'exercice en cours.";

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
    CANNOT_EDIT_POINTS_TOOLTIP_TEXT,
    questionUpsertionModalContentComponentMapping,
    questionPreviewingComponentMapping,
    SPLITTING_CHARACTER_FOR_ANSWERS,
};
