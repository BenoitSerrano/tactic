import { pathHandler } from '../../../lib/pathHandler';
import { computeEditingBreadcrumbs } from './computeEditingBreadcrumbs';

describe('computeEditingBreadcrumbs', () => {
    const examId = 'EXAMEN_1';
    it('should return empty array if on exam list', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_LIST');

        const editingBreadcrumbs = computeEditingBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([]);
    });

    it('should return first active if exam editing content', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId });

        const editingBreadcrumbs = computeEditingBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([
            { label: 'Examen', isActive: true },
            { label: 'Paramètres', isActive: false },
            { label: 'Collecte des réponses', isActive: false },
            { label: 'Résultats', isActive: false },
        ]);
    });

    it('should return third active if exam editing collect', () => {
        const currentPath = pathHandler.getRoutePath('EXAM_EDITING_COLLECT', { examId });

        const editingBreadcrumbs = computeEditingBreadcrumbs(currentPath);

        expect(editingBreadcrumbs).toEqual([
            { label: 'Examen', isActive: false },
            { label: 'Paramètres', isActive: false },
            { label: 'Collecte des réponses', isActive: true },
            { label: 'Résultats', isActive: false },
        ]);
    });
});
