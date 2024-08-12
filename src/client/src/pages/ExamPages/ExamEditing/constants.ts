import { ElementType } from 'react';
import { QCMUpsertionModalContent } from './QuestionUpsertionModal/QCMUpsertionModalContent';
import { QuestionReponseUpsertionModalContent } from './QuestionUpsertionModal/QuestionReponseUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './QuestionUpsertionModal/PhraseMelangeeUpsertionModalContent';
import { TexteLibreUpsertionModalContent } from './QuestionUpsertionModal/TexteLibreUpsertionModalContent';
import { TexteATrousUpsertionModalContent } from './QuestionUpsertionModal/TexteATrousUpsertionModalContent';
import { questionKindType } from '../../../types';
import { QcmEditing } from './QuestionPreviewing/QcmEditing';
import { QcmPreviewing } from './QuestionPreviewing/QcmPreviewing';
import { PointsPreviewing } from './QuestionPreviewing/PointsPreviewing';
import { PointsEditing } from './QuestionPreviewing/PointsEditing';
import { TexteLibrePreviewing } from './QuestionPreviewing/TexteLibrePreviewing';
import { TexteLibreEditing } from './QuestionPreviewing/TexteLibreEditing';
import { QuestionReponsePreviewing } from './QuestionPreviewing/QuestionReponsePreviewing';
import { QuestionReponseEditing } from './QuestionPreviewing/QuestionReponseEditing';
import { PhraseMelangeePreviewing } from './QuestionPreviewing/PhraseMelangeePreviewing';
import { PhraseMelangeeEditing } from './QuestionPreviewing/PhraseMelangeeEditing';
import { TexteATrousPreviewing } from './QuestionPreviewing/TexteATrous';
import { TexteATrousEditing } from './QuestionPreviewing/TexteATrous/TexteATrousEditing';

const viewModes = ['editing', 'previewing'] as const;
type viewModeType = (typeof viewModes)[number];

const pointsViewModeComponentMapping: Record<viewModeType, ElementType> = {
    editing: PointsEditing,
    previewing: PointsPreviewing,
};

const questionUpsertionModalContentComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QCMUpsertionModalContent,
    questionReponse: QuestionReponseUpsertionModalContent,
    phraseMelangee: PhraseMelangeeUpsertionModalContent,
    texteLibre: TexteLibreUpsertionModalContent,
    texteATrous: TexteATrousUpsertionModalContent,
};

const questionEditingComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QcmEditing,
    questionReponse: QuestionReponseEditing,
    phraseMelangee: PhraseMelangeeEditing,
    texteLibre: TexteLibreEditing,
    texteATrous: TexteATrousEditing,
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
    questionEditingComponentMapping,
    questionPreviewingComponentMapping,
    pointsViewModeComponentMapping,
    SPLITTING_CHARACTER_FOR_ANSWERS,
};

export type { viewModeType };
