import React from 'react';
import { Link } from 'react-router-dom';

function TeacherHome() {
    return (
        <ul>
            <li>
                <Link to="/teacher/exams">Liste des examens</Link>
            </li>
            <li>
                <Link to="/teacher/students">Liste des étudiant.es</Link>
            </li>
        </ul>
    );
}

export { TeacherHome };
