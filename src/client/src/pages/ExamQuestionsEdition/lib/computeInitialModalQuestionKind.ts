import { questionKindType } from '../../../types';
import { modalStatusType } from '../utils';

function computeInitialModalQuestionKind(
    modalStatus: modalStatusType,
    defaultQuestionKind: questionKindType,
) {
    switch (modalStatus.kind) {
        case 'creating':
            return defaultQuestionKind;
        case 'editing':
            return modalStatus.question.kind;
    }
}

export { computeInitialModalQuestionKind };
