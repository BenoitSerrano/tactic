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
    questionReponse: TemporaryEditing,
    phraseMelangee: TemporaryEditing,
    texteLibre: TemporaryEditing,
    texteATrous: TemporaryEditing,
};

const questionPreviewingComponentMapping: Record<questionKindType, ElementType> = {
    qcm: QcmPreviewing,
    questionReponse: TemporaryEditing,
    phraseMelangee: TemporaryEditing,
    texteLibre: TemporaryEditing,
    texteATrous: TemporaryEditing,
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