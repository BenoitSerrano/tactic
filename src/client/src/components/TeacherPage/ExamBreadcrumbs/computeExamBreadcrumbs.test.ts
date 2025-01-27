import { pathHandler } from '../../../lib/pathHandler';
import { computeExamBreadcrumbs } from './computeExamBreadcrumbs';

describe('computeExamBreadcrumbs', () => {
    const examId = 'EXAMEN_1';

    it('should return first active if exam editing content', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });

        const editingBreadcrumbs = computeExamBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([
            {
                label: "Éditer l'examen",
                isActive: true,
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId }),
            },
            {
                label: "Paramètres de l'examen",
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_PARAMETERS', { examId }),
            },
            {
                label: "Lien de l'examen",
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_ATTEMPT_COLLECT', { examId }),
            },
            {
                label: 'Résultats',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_RESULTS', { examId }),
            },
            {
                label: 'Accès aux copies corrigées',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_CONSULT', { examId }),
            },
        ]);
    });

    it('should return third active if exam editing collect', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_ATTEMPT_COLLECT', { examId });

        const editingBreadcrumbs = computeExamBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([
            {
                label: "Éditer l'examen",
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId }),
            },
            {
                label: "Paramètres de l'examen",
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_PARAMETERS', { examId }),
            },
            {
                label: "Lien de l'examen",
                isActive: true,
                href: pathHandler.getRoutePath('EXAM_ATTEMPT_COLLECT', { examId }),
            },
            {
                label: 'Résultats',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_RESULTS', { examId }),
            },
            {
                label: 'Accès aux copies corrigées',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_CONSULT', { examId }),
            },
        ]);
    });
});
