import { pathHandler } from '../../../lib/pathHandler';
import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're home", () => {
        const pathname = pathHandler.getRoutePath('TEACHER_HOME');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil' }]);
    });

    it("returns exams when you're on exam page", () => {
        const pathname = pathHandler.getRoutePath('EXAMS');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens' },
        ]);
    });

    it("returns exams edit exercises when you're on exam edit exercises page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_EXERCISES', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Liste des exercices' },
        ]);
    });

    it("returns exams edit when you're on exam edit page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_EDITING', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Édition' },
        ]);
    });

    it("returns exams questions edit when you're on exam edit questions page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_QUESTIONS_EDITION', {
            examId: 'examId',
            exerciseId: 'exerciseId',
        });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Liste des exercices', href: '/teacher/exams/examId/exercises' },
            { label: 'Liste des questions' },
        ]);
    });

    it("returns exams edit when you're on exam results page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_RESULTS', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Résultats' },
        ]);
    });

    it("returns exams preview when you're on exam preview page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_PREVIEWING', { examId: 'examId' });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Prévisualisation' },
        ]);
    });

    it("returns exams details when you're on exam details page", () => {
        const pathname = pathHandler.getRoutePath('EXAM_CHECKING', {
            examId: 'examId',
            attemptId: 'attemptId',
        });

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Résultats', href: '/teacher/exams/examId/results' },
            { label: 'Correction de copie' },
        ]);
    });

    it("returns groups when you're on students page", () => {
        const pathname = pathHandler.getRoutePath('GROUPS');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Mes groupes' },
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
            { label: 'Liste des étudiants' },
        ]);
    });
});
