import { questionType } from './types';

type modalStatusType = { kind: 'editing'; question: questionType } | { kind: 'creating' };

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
