import { pathHandler } from '../../../lib/pathHandler';
import { editingExamLabelMapping } from '../constants';
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
        case 'CLASSES':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes classes', isActive: true });
            break;
        case 'TEACHER_HOME':
            breadcrumbs.push({ label: 'Accueil', isActive: true });
            break;

        case 'EXAM_EDITING_CONTENT':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', parsedPath.parameters),
            });
            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_PARAMETERS':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', parsedPath.parameters),
            });
            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_ATTEMPT_COLLECT':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', parsedPath.parameters),
            });
            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_RESULTS':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', parsedPath.parameters),
            });
            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_CONSULT':
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({ label: 'Mes examens', href: pathHandler.getRoutePath('EXAM_LIST') });
            breadcrumbs.push({
                label: 'Édition',
                href: pathHandler.getRoutePath('EXAM_EDITING_CONTENT', parsedPath.parameters),
            });
            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
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
            breadcrumbs.push({
                label: 'Résultats',
                href: pathHandler.getRoutePath('EXAM_RESULTS', {
                    examId: parsedPath.parameters.examId,
                }),
            });

            breadcrumbs.push({ label: 'Correction de copie', isActive: true });
            break;
        case 'STUDENTS':
            const { establishmentId } = parsedPath.parameters;
            breadcrumbs.push({ label: 'Accueil', href: pathHandler.getRoutePath('TEACHER_HOME') });
            breadcrumbs.push({
                label: 'Mes classes',
                href: pathHandler.getRoutePath('CLASSES', { establishmentId }),
            });
            breadcrumbs.push({ label: 'Liste des étudiants', isActive: true });
            break;
    }

    return breadcrumbs;
}

export { computeBreadcrumbs };
