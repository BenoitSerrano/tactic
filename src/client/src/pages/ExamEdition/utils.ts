type modalStatusType<questionTypeT> =
    | { kind: 'editing'; question: questionTypeT }
    | { kind: 'creating' };

function computeConfirmButtonLabel<T>(modalStatus: modalStatusType<T>) {
    switch (modalStatus.kind) {
        case 'creating':
            return 'Créer';
        case 'editing':
            return 'Modifier';
    }
}

function computeModalTitlePrefix<T>(modalStatus: modalStatusType<T>) {
    switch (modalStatus.kind) {
        case 'creating':
            return 'Création';
        case 'editing':
            return 'Édition';
    }
}

export { computeConfirmButtonLabel, computeModalTitlePrefix };

export type { modalStatusType };
