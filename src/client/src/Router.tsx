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
import { NotFound } from './pages/NotFound';
import { AdminPage } from './components/AdminPage';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { api } from './lib/api';

function Router() {
    return (
        <Routes>
            {adminRoutes.map((adminRoute) => (
                <Route
                    key={adminRoute.suffixPath}
                    path={`/teacher/${adminRoute.suffixPath}`}
                    element={<AdminPage>{adminRoute.element}</AdminPage>}
                />
            ))}
            <Route path="/" element={<Home />} />
            <Route
                path="/sign-up"
                element={<SignIn apiCall={api.createUser} title="Créer un compte" />}
            />
            <Route path="/sign-in" element={<SignIn apiCall={api.login} title="Se connecter" />} />
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

const adminRoutes = [
    { suffixPath: `exams`, element: <Exams /> },
    { suffixPath: `students`, element: <Students /> },
    { suffixPath: `exams/:examId/edit`, element: <ExamEdition /> },
    { suffixPath: `exams/:examId/results`, element: <ExamResults /> },
    { suffixPath: `exams/:examId/results/:attemptId`, element: <ExamChecking /> },
    { suffixPath: ``, element: <TeacherHome /> },
];

export { Router };
