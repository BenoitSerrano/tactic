import { questionKindType } from '../../types';
import { questionWithAnswersType } from './types';

type modalStatusType =
    | { kind: 'editing'; question: questionWithAnswersType }
    | { kind: 'creating'; questionKind: questionKindType };

function computeConfirmButtonLabel(modalStatus: modalStatusType) {
    switch (modalStatus.kind) {
        case 'creating':
            return 'Créer';
        case 'editing':
            return 'Modifier';
    }
}

function computeModalTitlePrefix(modalStatus: modalStatusType) {
    switch (modalStatus.kind) {
        case 'creating':
            return 'Création';
        case 'editing':
            return 'Édition';
    }
}

export { computeConfirmButtonLabel, computeModalTitlePrefix };

export type { modalStatusType };
