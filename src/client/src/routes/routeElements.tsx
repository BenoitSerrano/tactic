import { api } from '../lib/api';
import { ExamDone } from '../pages/ExamDone';
import { ExamChecking } from '../pages/ExamPages/ExamChecking';
import { ExamConsulting } from '../pages/ExamPages/ExamConsulting';
import { ExamPreviewing } from '../pages/ExamPages/ExamPreviewing';
import { ExamTaking } from '../pages/ExamPages/ExamTaking';
import { ExamResults } from '../pages/ExamResults';
import { ExamList } from '../pages/ExamList';
import { Groups } from '../pages/StudentsPages/Groups';
import { Home } from '../pages/Home';
import { RequestResetPassword } from '../pages/RequestResetPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { ResetPasswordFailure } from '../pages/ResetPasswordFailure';
import { ResetPasswordRequested } from '../pages/ResetPasswordRequested';
import { ResetPasswordSuccess } from '../pages/ResetPasswordSuccess';
import { SignIn } from '../pages/SignIn';
import { StudentAuthentication } from '../pages/StudentAuthentication';
import { StudentHome } from '../pages/StudentHome';
import { Students } from '../pages/StudentsPages/Students';
import { ROUTE_KEYS } from './routeKeys';
import { ExamEditing } from '../pages/ExamPages/ExamEditing';
import { ExamArchived } from '../pages/ExamArchived';
import { AttemptNotCorrected } from '../pages/AttemptNotCorrected';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import { ExamParameters } from '../pages/ExamParameters';
import { ExamCollect } from '../pages/ExamCollect';
import { ExamConsult } from '../pages/ExamConsult';
import { StudentRegistration } from '../pages/StudentRegistration';
import { NotFound } from '../pages/NotFound';
import { StudentAuthenticationExamTakingRedirection } from '../pages/StudentAuthenticationExamTakingRedirection';

const ROUTE_ELEMENTS: Record<
    (typeof ROUTE_KEYS)[number],
    { element: JSX.Element; isAdmin?: boolean }
> = {
    EXAM_TAKING: {
        element: <ExamTaking />,
    },
    EXAM_EDITING_CONTENT: {
        isAdmin: true,
        element: <ExamEditing />,
    },
    EXAM_PARAMETERS: {
        isAdmin: true,
        element: <ExamParameters />,
    },
    EXAM_ATTEMPT_COLLECT: {
        isAdmin: true,
        element: <ExamCollect />,
    },
    EXAM_RESULTS: {
        isAdmin: true,
        element: <ExamResults />,
    },
    EXAM_CONSULT: {
        isAdmin: true,
        element: <ExamConsult />,
    },
    STUDENT_HOME: {
        element: <StudentHome />,
    },
    STUDENT_AUTHENTICATION: {
        element: <StudentAuthentication />,
    },
    STUDENT_REGISTRATION: {
        element: <StudentRegistration />,
    },
    RESET_PASSWORD_FAILURE: {
        element: <ResetPasswordFailure />,
    },
    RESET_PASSWORD_SUCCESS: {
        element: <ResetPasswordSuccess />,
    },
    RESET_PASSWORD_REQUESTED: {
        element: <ResetPasswordRequested />,
    },
    RESET_PASSWORD: {
        element: <ResetPassword />,
    },
    REQUEST_RESET_PASSWORD: {
        element: <RequestResetPassword />,
    },
    SIGN_IN: {
        element: <SignIn shouldDisplayResetPasswordLink apiCall={api.login} title="Se connecter" />,
    },
    SIGN_UP: {
        element: <SignIn apiCall={api.createUser} title="Créer un compte" />,
    },
    HOME: {
        element: <Home />,
    },
    EXAM_CONSULTING: {
        element: <ExamConsulting />,
    },
    EXAM_DONE: {
        element: <ExamDone />,
    },
    EXAM_ARCHIVED: {
        element: <ExamArchived />,
    },
    EXAM_LIST: { isAdmin: true, element: <Navigate to={ROUTE_PATHS.EXAM_LIST_CURRENT.path} /> },
    EXAM_LIST_ARCHIVED: { isAdmin: true, element: <ExamList filter="archived" /> },
    EXAM_LIST_CURRENT: { isAdmin: true, element: <ExamList filter="current" /> },
    STUDENTS: { isAdmin: true, element: <Students /> },
    EXAM_PREVIEWING: {
        isAdmin: false,
        element: <ExamPreviewing />,
    },
    EXAM_CHECKING: {
        isAdmin: true,

        element: <ExamChecking />,
    },
    TEACHER_HOME: { isAdmin: true, element: <Navigate to={ROUTE_PATHS.EXAM_LIST.path} /> },
    GROUPS: { isAdmin: true, element: <Groups /> },
    ATTEMPT_NOT_CORRECTED: { element: <AttemptNotCorrected /> },
    STUDENT_AUTHENTICATION_EXAM_TAKING_SHORTENED: {
        element: <StudentAuthenticationExamTakingRedirection />,
    },
    NOT_FOUND: { element: <NotFound /> },
};

export { ROUTE_ELEMENTS };
