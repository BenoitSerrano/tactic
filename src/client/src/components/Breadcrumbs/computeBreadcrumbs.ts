import { establishmentWithClassesType } from '../../lib/api/api';
import { pathHandler } from '../../lib/pathHandler';
import { editingExamLabelMapping } from './constants';
import { breadcrumbItemType } from './types';

function computeBreadcrumbs(
    pathname: string,
    establishments: Array<establishmentWithClassesType>,
): Array<breadcrumbItemType> {
    const breadcrumbs: Array<breadcrumbItemType> = [];
    const parsedPath = pathHandler.parsePath(pathname);
    let establishment: establishmentWithClassesType | undefined;
    let classe: { id: string; name: string } | undefined;
    if (!parsedPath) {
        return breadcrumbs;
    }
    switch (parsedPath.routeKey) {
        case 'STUDENTS':
            breadcrumbs.push({
                label: 'Accueil',
                href: pathHandler.getRoutePath('TEACHER_HOME'),
            });
            establishment = establishments.find(
                (establishment) => establishment.id === parsedPath.parameters.establishmentId,
            );
            if (establishment) {
                breadcrumbs.push({
                    label: establishment.name,
                    href: pathHandler.getRoutePath('ESTABLISHMENT', {
                        establishmentId: establishment.id,
                    }),
                });
                classe = establishment?.classes.find(
                    (classe) => parsedPath.parameters.classeId === classe.id,
                );
                if (classe) {
                    breadcrumbs.push({
                        label: classe.name,
                        href: pathHandler.getRoutePath('CLASSE', {
                            establishmentId: establishment.id,
                            classeId: classe.id,
                        }),
                    });
                }
                breadcrumbs.push({ label: 'Mes élèves', isActive: true });
            }
            break;

        case 'EXAM_EDITING_CONTENT':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_PARAMETERS':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_ATTEMPT_COLLECT':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_RESULTS':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;
        case 'EXAM_CONSULT':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: editingExamLabelMapping[parsedPath.routeKey],
                isActive: true,
            });
            break;

        case 'EXAM_PREVIEWING':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({ label: 'Prévisualisation', isActive: true });
            break;
        case 'EXAM_CHECKING':
            breadcrumbs.push(
                ...computeBaseBreadcrumbsForExamEditingPages(
                    parsedPath.routeKey,
                    parsedPath.parameters,
                    establishments,
                ),
            );

            breadcrumbs.push({
                label: 'Résultats',
                href: pathHandler.getRoutePath('EXAM_RESULTS', parsedPath.parameters),
            });

            breadcrumbs.push({ label: 'Correction de copie', isActive: true });
            break;
    }

    return breadcrumbs;
}

function computeBaseBreadcrumbsForExamEditingPages(
    routeKey:
        | 'EXAM_EDITING_CONTENT'
        | 'EXAM_PARAMETERS'
        | 'EXAM_ATTEMPT_COLLECT'
        | 'EXAM_RESULTS'
        | 'EXAM_PREVIEWING'
        | 'EXAM_CHECKING'
        | 'EXAM_CONSULT',
    parameters: Record<string, string>,
    establishments: establishmentWithClassesType[],
): breadcrumbItemType[] {
    const breadcrumbs: Array<breadcrumbItemType> = [];

    breadcrumbs.push({
        label: 'Accueil',
        href: pathHandler.getRoutePath('TEACHER_HOME'),
    });
    const establishment = establishments.find(
        (establishment) => establishment.id === parameters.establishmentId,
    );
    if (establishment) {
        breadcrumbs.push({
            label: establishment.name,
            href: pathHandler.getRoutePath('ESTABLISHMENT', {
                establishmentId: establishment.id,
            }),
        });
        const classe = establishment?.classes.find((classe) => parameters.classeId === classe.id);
        if (classe) {
            breadcrumbs.push({
                label: classe.name,
                href: pathHandler.getRoutePath('CLASSE', {
                    establishmentId: establishment.id,
                    classeId: classe.id,
                }),
            });
        }
    }
    return breadcrumbs;
}

export { computeBreadcrumbs };
