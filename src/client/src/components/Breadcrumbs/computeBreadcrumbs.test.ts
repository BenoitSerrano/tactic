import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're home", () => {
        const pathname = '/teacher/ENCODED_PASSWORD';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil' }]);
    });

    it("returns exams when you're on exam page", () => {
        const pathname = '/teacher/ENCODED_PASSWORD/exams';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher/ENCODED_PASSWORD' },
            { label: 'Liste des examens' },
        ]);
    });

    it("returns exams edit when you're on exam edit page", () => {
        const pathname = '/teacher/ENCODED_PASSWORD/exams/examId/edit';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher/ENCODED_PASSWORD' },
            { label: 'Liste des examens', href: '/teacher/ENCODED_PASSWORD/exams' },
            { label: 'Éditer' },
        ]);
    });

    it("returns exams edit when you're on exam results page", () => {
        const pathname = '/teacher/ENCODED_PASSWORD/exams/examId/results';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher/ENCODED_PASSWORD' },
            { label: 'Liste des examens', href: '/teacher/ENCODED_PASSWORD/exams' },
            { label: 'Résultats' },
        ]);
    });

    it("returns exams details when you're on exam details page", () => {
        const pathname = '/teacher/ENCODED_PASSWORD/exams/examId/results/attemptId';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher/ENCODED_PASSWORD' },
            { label: 'Liste des examens', href: '/teacher/ENCODED_PASSWORD/exams' },
            { label: 'Résultats', href: '/teacher/ENCODED_PASSWORD/exams/examId/results' },
            { label: 'Correction de copie' },
        ]);
    });

    it("returns students when you're on students page", () => {
        const pathname = '/teacher/ENCODED_PASSWORD/students';

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([
            { label: 'Accueil', href: '/teacher/ENCODED_PASSWORD' },
            { label: 'Liste des étudiants' },
        ]);
    });
});
