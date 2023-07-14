import React from 'react';
import { Link } from 'react-router-dom';
import { authentication } from '../lib/authentication';
import { Breadcrumbs } from '../components/Breadcrumbs';

function TeacherHome() {
    return (
        <>
            <Breadcrumbs />
            <ul>
                <li>
                    <Link to={`/teacher/${authentication.getEncodedPassword()}/exams`}>
                        Liste des examens
                    </Link>
                </li>
                <li>
                    <Link to={`/teacher/${authentication.getEncodedPassword()}/students`}>
                        Liste des étudiant.es
                    </Link>
                </li>
            </ul>
        </>
    );
}

export { TeacherHome };
