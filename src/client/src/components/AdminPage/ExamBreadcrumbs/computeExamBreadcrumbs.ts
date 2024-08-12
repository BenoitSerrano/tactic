import { pathHandler } from '../../../lib/pathHandler';
import { EXAM_ROUTE_KEYS } from '../../../routes/routeKeys';
import { breadcrumbItemType } from '../types';
import { editingExamLabelMapping } from './constants';

function computeExamBreadcrumbs(currentPath: string): Array<breadcrumbItemType> {
    const parsedPath = pathHandler.parsePath(currentPath);
    if (!parsedPath) {
        return [];
    }
    if (!EXAM_ROUTE_KEYS.includes(parsedPath.routeKey as any)) {
        return [];
    }
    return EXAM_ROUTE_KEYS.map((EXAM_ROUTE_KEY) => ({
        label: editingExamLabelMapping[EXAM_ROUTE_KEY],
        isActive: EXAM_ROUTE_KEY === parsedPath.routeKey,
        href: pathHandler.getRoutePath(EXAM_ROUTE_KEY, parsedPath.parameters),
    }));
}

export { computeExamBreadcrumbs };
