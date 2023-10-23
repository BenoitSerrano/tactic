import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're home", () => {
        const pathname = '/teacher';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil' }]);
    });

    it("returns exams when you're on exam page", () => {
        const pathname = '/teacher/exams';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens' },
        ]);
    });

    it("returns exams edit when you're on exam edit page", () => {
        const pathname = '/teacher/exams/examId/exercises';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Liste des exercices' },
        ]);
    });

    it("returns exams questions edit when you're on exam edit questions page", () => {
        const pathname = '/teacher/exams/examId/exercises/exerciseId';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Liste des exercices', href: '/teacher/exams/examId/exercises' },
            { label: 'Liste des questions' },
        ]);
    });

    it("returns exams edit when you're on exam results page", () => {
        const pathname = '/teacher/exams/examId/results';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Résultats' },
        ]);
    });

    it("returns exams details when you're on exam details page", () => {
        const pathname = '/teacher/exams/examId/results/attemptId';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des examens', href: '/teacher/exams' },
            { label: 'Résultats', href: '/teacher/exams/examId/results' },
            { label: 'Correction de copie' },
        ]);
    });

    it("returns students when you're on students page", () => {
        const pathname = '/teacher/students';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher' },
            { label: 'Liste des étudiants' },
        ]);
    });
});
