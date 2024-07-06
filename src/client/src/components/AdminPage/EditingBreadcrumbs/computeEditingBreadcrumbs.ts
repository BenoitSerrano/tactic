import { pathHandler } from '../../../lib/pathHandler';
import { EDITING_EXAM_ROUTE_KEYS } from '../../../routes/routeKeys';
import { breadcrumbItemType } from '../types';
import { editingExamLabelMapping } from './constants';

function computeEditingBreadcrumbs(currentPath: string): Array<breadcrumbItemType> {
    const parsedPath = pathHandler.parsePath(currentPath);
    if (!parsedPath) {
        return [];
    }
    if (!EDITING_EXAM_ROUTE_KEYS.includes(parsedPath.routeKey as any)) {
        return [];
    }
    return EDITING_EXAM_ROUTE_KEYS.map((EDITING_EXAM_ROUTE_KEY) => ({
        label: editingExamLabelMapping[EDITING_EXAM_ROUTE_KEY],
        isActive: EDITING_EXAM_ROUTE_KEY === parsedPath.routeKey,
        href: pathHandler.getRoutePath(EDITING_EXAM_ROUTE_KEY, parsedPath.parameters),
    }));
}

export { computeEditingBreadcrumbs };
