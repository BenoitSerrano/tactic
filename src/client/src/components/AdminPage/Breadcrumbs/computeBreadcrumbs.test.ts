import { pathHandler } from '../../../lib/pathHandler';
import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're on home page", () => {
        const pathname = pathHandler.getRoutePath('TEACHER_HOME');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil', isActive: true }]);
    });
    it("returns exams when you're on exam page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_LIST');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Mes examens', isActive: true },
        ]);
    });

    it("returns exams when you're on exam archived page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_LIST_ARCHIVED');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Mes examens', isActive: true },
        ]);
    });

    it("returns exams when you're on exam current page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_LIST_CURRENT');

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
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') },
            { label: 'Édition', isActive: true },
        ]);
    });
    it("returns exams edit when you're on exam edit results page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_EDITING_RESULTS', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') },
            { label: 'Édition', isActive: true },
        ]);
    });

    it("returns exams edit when you're on exam results page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_RESULTS', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') },
            { label: 'Résultats', isActive: true },
        ]);
    });

    it("returns exams preview when you're on exam preview page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_PREVIEWING', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') },
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
            { label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') },
            { label: 'Résultats', href: '/teacher/exams/examId/results' },
            { label: 'Correction de copie', isActive: true },
        ]);
    });

    it("returns groups when you're on students page", () => {
        const pathname = pathHandler.getRoutePath('GROUPS');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes groupes', isActive: true },
        ]);
    });

    it("returns students when you're on students page", () => {
        const pathname = pathHandler.getRoutePath('STUDENTS', {
            groupId: 'groupId',
        });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') },
            { label: 'Mes groupes', href: pathHandler.getRoutePath('GROUPS') },
            { label: 'Liste des étudiants', isActive: true },
        ]);
    });
});
