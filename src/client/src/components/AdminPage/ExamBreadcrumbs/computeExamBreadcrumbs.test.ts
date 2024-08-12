import { pathHandler } from '../../../lib/pathHandler';
import { computeExamBreadcrumbs } from './computeExamBreadcrumbs';

describe('computeExamBreadcrumbs', () => {
    const examId = 'EXAMEN_1';
    it('should return empty array if on exam list', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_LIST');

        const editingBreadcrumbs = computeExamBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([]);
    });

    it('should return first active if exam editing content', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });

        const editingBreadcrumbs = computeExamBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([
            {
                label: 'Contenu',
                isActive: true,
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId }),
            },
            {
                label: 'Paramètres',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_PARAMETERS', { examId }),
            },
            {
                label: 'Collecte des réponses',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_ATTEMPT_COLLECT', { examId }),
            },
            {
                label: 'Résultats',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_RESULTS', { examId }),
            },
            {
                label: 'Consultation des copies',
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
                label: 'Contenu',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId }),
            },
            {
                label: 'Paramètres',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_PARAMETERS', { examId }),
            },
            {
                label: 'Collecte des réponses',
                isActive: true,
                href: pathHandler.getRoutePath('EXAM_ATTEMPT_COLLECT', { examId }),
            },
            {
                label: 'Résultats',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_RESULTS', { examId }),
            },
            {
                label: 'Consultation des copies',
                isActive: false,
                href: pathHandler.getRoutePath('EXAM_CONSULT', { examId }),
            },
        ]);
    });
});
