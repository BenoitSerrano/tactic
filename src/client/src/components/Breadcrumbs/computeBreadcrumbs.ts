function computeBreadcrumbs(pathname: string): Array<{ label: string; href?: string }> {
    const breadcrumbs = [];
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 0) {
        return [];
    }
    if (path[0] !== 'teacher') {
        return [];
    }

    const homeHref = path.length > 2 ? `/${path.slice(0, 2).join('/')}` : undefined;

    breadcrumbs.push({ label: 'Accueil', href: homeHref });

    if (path.length === 2) {
        return breadcrumbs;
    }

    if (path[2] === 'exams') {
        const examsHref = path.length > 3 ? `/${path.slice(0, 3).join('/')}` : undefined;
        breadcrumbs.push({ label: 'Liste des examens', href: examsHref });
        if (path.length === 3) {
            return breadcrumbs;
        }
        if (path[4] === 'edit') {
            const editExamHref = undefined;
            breadcrumbs.push({ label: 'Éditer', editExamHref });
        } else if (path[4] === 'results') {
            const examResultsHref = path.length > 5 ? `/${path.slice(0, 5).join('/')}` : undefined;
            breadcrumbs.push({ label: 'Résultats', href: examResultsHref });
            if (path.length === 5) {
                return breadcrumbs;
            }
            breadcrumbs.push({ label: 'Correction de copie' });
        }
    } else if (path[2] === 'students') {
        const studentsHref = path.length > 3 ? `/${path.slice(0, 3).join('/')}` : undefined;
        breadcrumbs.push({ label: 'Liste des étudiants', href: studentsHref });
    }

    return breadcrumbs;
}

export { computeBreadcrumbs };
