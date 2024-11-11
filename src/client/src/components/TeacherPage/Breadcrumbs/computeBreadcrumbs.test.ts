import { pathHandler } from '../../../lib/pathHandler';
import { computeBreadcrumbs } from './computeBreadcrumbs';

describe('computeBreadcrumbs', () => {
    it("returns home when you're on home page", () => {
        const pathname = pathHandler.getRoutePath('TEACHER_HOME');

        const breadcrumbs = computeBreadcrumbs(pathname);

        expect(breadcrumbs).toEqual([{ label: 'Accueil', isActive: true }]);
    });
});
