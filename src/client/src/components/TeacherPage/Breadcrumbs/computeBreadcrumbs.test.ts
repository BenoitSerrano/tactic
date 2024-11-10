import { pathHandler } from '../../../lib/pathHandler';
import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're on home page", () => {
        const pathname = pathHandler.getRoutePath('TEACHER_HOME');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil', isActive: true }]);
    });
    it("returns exams when you're on exam page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_LIST_FOR_ALL');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Mes examens', isActive: true },
        ]);
    });

    it("returns exams edit when you're on exam edit content page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST_FOR_ALL') },
            {
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId: 'examId' }),
            },
            { label: "Éditer l'examen", isActive: true },
        ]);
    });
    it("returns exams edit when you're on exam edit results page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_RESULTS', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST_FOR_ALL') },
            {
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId: 'examId' }),
            },
            { label: 'Résultats', isActive: true },
        ]);
    });
    it("returns exams edit when you're on exam edit consult page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_CONSULT', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST_FOR_ALL') },
            {
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId: 'examId' }),
            },
            { label: 'Accès aux copies corrigées', isActive: true },
        ]);
    });

    it("returns exams preview when you're on exam preview page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_PREVIEWING', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST_FOR_ALL') },
            { label: 'Prévisualisation', isActive: true },
        ]);
    });

    it("returns exams details when you're on exam details page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_CHECKING', {
            examId: 'examId',
            attemptId: 'attemptId',
        });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST_FOR_ALL') },
            {
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', { examId: 'examId' }),
            },
            {
                label: 'Résultats',
                href: pathHandler.getRoutePath('EXAM_RESULTS', { examId: 'examId' }),
            },
            { label: 'Correction de copie', isActive: true },
        ]);
    });
});
