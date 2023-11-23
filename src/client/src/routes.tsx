import { api } from './lib/api';
import { ExamDone } from './pages/ExamDone';
import { ExamExercises } from './pages/ExamExercises';
import { ExamChecking } from './pages/ExamPages/ExamChecking';
import { ExamConsulting } from './pages/ExamPages/ExamConsulting';
import { ExamPreviewing } from './pages/ExamPages/ExamPreviewing';
import { ExamTaking } from './pages/ExamPages/ExamTaking';
import { ExamQuestionsEdition } from './pages/ExamQuestionsEdition';
import { ExamResults } from './pages/ExamResults';
import { Exams } from './pages/Exams';
import { Home } from './pages/Home';
import { RequestResetPassword } from './pages/RequestResetPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ResetPasswordFailure } from './pages/ResetPasswordFailure';
import { ResetPasswordRequested } from './pages/ResetPasswordRequested';
import { ResetPasswordSuccess } from './pages/ResetPasswordSuccess';
import { SignIn } from './pages/SignIn';
import { StudentAuthentication } from './pages/StudentAuthentication';
import { StudentHome } from './pages/StudentHome';
import { Students } from './pages/Students';
import { TeacherHome } from './pages/TeacherHome';

const ROUTE_KEYS = [
    'EXAM_TAKING',
    'STUDENT_HOME',
    'STUDENT_AUTHENTICATION',
    'RESET_PASSWORD_FAILURE',
    'RESET_PASSWORD_SUCCESS',
    'RESET_PASSWORD_REQUESTED',
    'RESET_PASSWORD',
    'REQUEST_RESET_PASSWORD',
    'SIGN_IN',
    'SIGN_UP',
    'HOME',
    'EXAM_CONSULTING',
    'EXAM_DONE',
    'EXAMS',
    'STUDENTS',
    'EXAM_EXERCISES',
    'EXAM_QUESTIONS_EDITION',
    'EXAM_RESULTS',
    'EXAM_PREVIEWING',
    'EXAM_CHECKING',
    'TEACHER_HOME',
] as const;

const ROUTES: Record<
    (typeof ROUTE_KEYS)[number],
    { path: string; element: JSX.Element; isAdmin?: boolean }
> = {
    EXAM_TAKING: {
        path: '/student/students/:studentId/attempts/:attemptId/take',
        element: <ExamTaking />,
    },
    STUDENT_HOME: {
        path: '/student/exams/:examId/students/:studentId',
        element: <StudentHome />,
    },
    STUDENT_AUTHENTICATION: {
        path: '/student/exams/:examId',
        element: <StudentAuthentication />,
    },
    RESET_PASSWORD_FAILURE: {
        path: '/reset-password-failure',
        element: <ResetPasswordFailure />,
    },
    RESET_PASSWORD_SUCCESS: {
        path: '/reset-password-success',
        element: <ResetPasswordSuccess />,
    },
    RESET_PASSWORD_REQUESTED: {
        path: '/reset-password-requested',
        element: <ResetPasswordRequested />,
    },
    RESET_PASSWORD: {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    REQUEST_RESET_PASSWORD: {
        path: '/request-reset-password',
        element: <RequestResetPassword />,
    },
    SIGN_IN: {
        path: '/sign-in',
        element: <SignIn shouldDisplayResetPasswordLink apiCall={api.login} title="Se connecter" />,
    },
    SIGN_UP: {
        path: '/sign-up',
        element: <SignIn apiCall={api.createUser} title="Créer un compte" />,
    },
    HOME: {
        path: '/',
        element: <Home />,
    },
    EXAM_CONSULTING: {
        path: '/student/students/:studentId/attempts/:attemptId/consult',
        element: <ExamConsulting />,
    },
    EXAM_DONE: {
        path: '/student/students/:studentId/exam-done',
        element: <ExamDone />,
    },
    EXAMS: { isAdmin: true, path: `/teacher/exams`, element: <Exams /> },
    STUDENTS: { isAdmin: true, path: `/teacher/students`, element: <Students /> },
    EXAM_EXERCISES: {
        isAdmin: true,
        path: `/teacher/exams/:examId/exercises`,
        element: <ExamExercises />,
    },
    EXAM_QUESTIONS_EDITION: {
        isAdmin: true,
        path: `/teacher/exams/:examId/exercises/:exerciseId`,
        element: <ExamQuestionsEdition />,
    },
    EXAM_RESULTS: {
        isAdmin: true,
        path: `/teacher/exams/:examId/results`,
        element: <ExamResults />,
    },
    EXAM_PREVIEWING: {
        isAdmin: true,
        path: `/teacher/exams/:examId/preview`,
        element: <ExamPreviewing />,
    },
    EXAM_CHECKING: {
        isAdmin: true,
        path: `/teacher/exams/:examId/results/:attemptId`,
        element: <ExamChecking />,
    },
    TEACHER_HOME: { isAdmin: true, path: `/teacher/`, element: <TeacherHome /> },
};

export { ROUTES, ROUTE_KEYS };
