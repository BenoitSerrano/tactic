function computeBreadcrumbs(pathname: string): Array<{ label: string; href?: string }> {
    const breadcrumbs = [];
    const path = pathname.split('/').filter(Boolean);
    if (path.length === 0) {
        return [];
    }
    if (path[0] !== 'teacher') {
        return [];
    }

    const homeHref = path.length > 1 ? `/${path.slice(0, 1).join('/')}` : undefined;

    breadcrumbs.push({ label: 'Accueil', href: homeHref });

    if (path.length === 1) {
        return breadcrumbs;
    }

    if (path[1] === 'exams') {
        const examsHref = path.length > 2 ? `/${path.slice(0, 2).join('/')}` : undefined;
        breadcrumbs.push({ label: 'Liste des examens', href: examsHref });
        if (path.length === 2) {
            return breadcrumbs;
        }
        if (path[3] === 'exercises') {
            const exercisesHref = path.length > 4 ? `/${path.slice(0, 4).join('/')}` : undefined;
            breadcrumbs.push({ label: 'Liste des exercices', href: exercisesHref });
            if (path.length === 4) {
                return breadcrumbs;
            }
            breadcrumbs.push({ label: 'Liste des questions' });
        } else if (path[3] === 'results') {
            const examResultsHref = path.length > 4 ? `/${path.slice(0, 4).join('/')}` : undefined;
            breadcrumbs.push({ label: 'Résultats', href: examResultsHref });
            if (path.length === 4) {
                return breadcrumbs;
            }
            breadcrumbs.push({ label: 'Correction de copie' });
        }
    } else if (path[1] === 'students') {
        const studentsHref = path.length > 2 ? `/${path.slice(0, 2).join('/')}` : undefined;
        breadcrumbs.push({ label: 'Liste des étudiants', href: studentsHref });
    }

    return breadcrumbs;
}

export { computeBreadcrumbs };
