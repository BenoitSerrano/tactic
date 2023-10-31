import { Routes, Route } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { ExamQuestionsEdition } from './pages/ExamQuestionsEdition';
import { Students } from './pages/Students';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { ExamTaking } from './pages/ExamTaking';
import { ExamResults } from './pages/ExamResults';
import { ExamChecking } from './pages/ExamChecking';
import { TeacherHome } from './pages/TeacherHome';
import { ExamDone } from './pages/ExamDone';
import { StudentHome } from './pages/StudentHome';
import { NotFound } from './pages/NotFound';
import { AdminPage } from './components/AdminPage';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { api } from './lib/api';
import { ExamExercises } from './pages/ExamExercises';
import { RequestResetPassword } from './pages/RequestResetPassword';
import { ResetPasswordRequested } from './pages/ResetPasswordRequested';
import { ResetPassword } from './pages/ResetPassword';
import { ResetPasswordSuccess } from './pages/ResetPasswordSuccess';
import { ResetPasswordFailure } from './pages/ResetPasswordFailure';

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
            <Route
                path="/sign-in"
                element={
                    <SignIn
                        shouldDisplayResetPasswordLink
                        apiCall={api.login}
                        title="Se connecter"
                    />
                }
            />
            <Route path="/request-reset-password" element={<RequestResetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password-requested" element={<ResetPasswordRequested />} />
            <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
            <Route path="/reset-password-failure" element={<ResetPasswordFailure />} />
            <Route path="/student/exams/:examId" element={<StudentAuthentication />} />
            <Route path="/student/exams/:examId/students/:studentId" element={<StudentHome />} />
            <Route
                path="/student/students/:studentId/attempts/:attemptId"
                element={<ExamTaking />}
            />
            <Route path="/student/students/:studentId/exam-done" element={<ExamDone />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

const adminRoutes = [
    { suffixPath: `exams`, element: <Exams /> },
    { suffixPath: `students`, element: <Students /> },
    { suffixPath: `exams/:examId/exercises`, element: <ExamExercises /> },
    { suffixPath: `exams/:examId/exercises/:exerciseId`, element: <ExamQuestionsEdition /> },
    { suffixPath: `exams/:examId/results`, element: <ExamResults /> },
    { suffixPath: `exams/:examId/results/:attemptId`, element: <ExamChecking /> },
    { suffixPath: ``, element: <TeacherHome /> },
];

export { Router };
