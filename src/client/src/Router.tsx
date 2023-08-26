import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamEdition } from './pages/ExamEdition';
import { Students } from './pages/Students';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { ExamTaking } from './pages/ExamTaking';
import { ExamResults } from './pages/ExamResults';
import { ExamChecking } from './pages/ExamChecking';
import { TeacherHome } from './pages/TeacherHome';
import { ExamDone } from './pages/ExamDone';
import { StudentHome } from './pages/StudentHome';
import { EmptyAttemptCreated } from './pages/EmptyAttemptCreated';
import { authentication } from './lib/authentication';
import { TeacherLogin } from './pages/TeacherLogin';
import { NotFound } from './pages/NotFound';
import { AdminPage } from './components/AdminPage';
import { Breadcrumbs } from './components/Breadcrumbs';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';

function Router() {
    const encodedPassword = authentication.getEncodedPassword();

    return (
        <Routes>
            {authenticatedRoutes.map((authenticatedRoute) => (
                <Route
                    key={authenticatedRoute.suffixPath}
                    path={`/teacher/${encodedPassword}/${authenticatedRoute.suffixPath}`}
                    element={
                        <AdminPage>
                            <Breadcrumbs />
                            {authenticatedRoute.element}
                        </AdminPage>
                    }
                />
            ))}
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/student/exams/:examId" element={<StudentAuthentication />} />
            <Route path="/student/exams/:examId/students/:studentId" element={<StudentHome />} />
            <Route
                path="/student/students/:studentId/attempts/:attemptId"
                element={<ExamTaking />}
            />
            <Route path="/student/students/:studentId/exam-done" element={<ExamDone />} />
            <Route path="/student/empty-attempt-created" element={<EmptyAttemptCreated />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

const authenticatedRoutes = [
    { suffixPath: `exams`, element: <Exams /> },
    { suffixPath: `students`, element: <Students /> },
    { suffixPath: `exams/:examId/edit`, element: <ExamEdition /> },
    { suffixPath: `exams/:examId/results`, element: <ExamResults /> },
    { suffixPath: `exams/:examId/results/:attemptId`, element: <ExamChecking /> },
    { suffixPath: ``, element: <TeacherHome /> },
];

export { Router };
