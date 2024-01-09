import { ElementType } from 'react';
import { QCMUpsertionModalContent } from './QuestionUpsertionModal/QCMUpsertionModalContent';
import { QuestionReponseUpsertionModalContent } from './QuestionUpsertionModal/QuestionReponseUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './QuestionUpsertionModal/PhraseMelangeeUpsertionModalContent';
import { TexteLibreUpsertionModalContent } from './QuestionUpsertionModal/TexteLibreUpsertionModalContent';
import { TexteATrousUpsertionModalContent } from './QuestionUpsertionModal/TexteATrousUpsertionModalContent';
import { questionKindType } from '../../../types';
import { QcmEditing } from './QuestionViewMode/QcmEditing';
import { TemporaryEditing } from './QuestionViewMode/TemporaryEditing';
import { QcmPreviewing } from './QuestionViewMode/QcmPreviewing';
import { PointsPreviewing } from './QuestionViewMode/PointsPreviewing';
import { PointsEditing } from './QuestionViewMode/PointsEditing';
import { TexteLibrePreviewing } from './QuestionViewMode/TexteLibrePreviewing';
import { TexteLibreEditing } from './QuestionViewMode/TexteLibreEditing';
import { QuestionReponsePreviewing } from './QuestionViewMode/QuestionReponsePreviewing';
import { QuestionReponseEditing } from './QuestionViewMode/QuestionReponseEditing';
import { PhraseMelangeePreviewing } from './QuestionViewMode/PhraseMelangeePreviewing';
import { PhraseMelangeeEditing } from './QuestionViewMode/PhraseMelangeeEditing';
import { TexteATrousPreviewing } from './QuestionViewMode/TexteATrous';
import { TexteATrousEditing } from './QuestionViewMode/TexteATrous/TexteATrousEditing';

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
