import { pathHandler } from '../../../lib/pathHandler';
import { breadcrumbItemType } from '../types';

function computeBreadcrumbs(pathname: string): Array<breadcrumbItemType> {
    const breadcrumbs: Array<breadcrumbItemType> = [];
    const parsedPath = pathHandler.parsePath(pathname);
    if (!parsedPath) {
        return breadcrumbs;
    }
    switch (parsedPath.routeKey) {
        case 'EXAM_LIST':
        case 'EXAM_LIST_CURRENT':
        case 'EXAM_LIST_ARCHIVED':
            breadcrumbs.push({ label: 'Accueil', href: '/teacher' });
            breadcrumbs.push({ label: 'Mes examens', isActive: true });
            break;
        case 'GROUPS':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes groupes', isActive: true });
            break;
        case 'TEACHER_HOME':
            breadcrumbs.push({ label: 'Accueil', isActive: true });
            break;
        case 'EXAM_EDITING_COLLECT':
        case 'EXAM_EDITING_CONTENT':
        case 'EXAM_EDITING_PARAMETERS':
        case 'EXAM_EDITING_RESULTS':
        case 'EXAM_EDITING_CONSULT':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({ label: 'Édition', isActive: true });
            break;

        case 'EXAM_PREVIEWING':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({ label: 'Prévisualisation', isActive: true });
            break;
        case 'EXAM_CHECKING':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', {
                    examId: parsedPath.parameters.examId,
                }),
            });

            breadcrumbs.push({ label: 'Correction de copie', isActive: true });
            break;
        case 'STUDENTS':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes groupes', href: pathHandler.getRoutePath('GROUPS') });
            breadcrumbs.push({ label: 'Liste des étudiants', isActive: true });
            break;
    }

    return breadcrumbs;
}

export { computeBreadcrumbs };
