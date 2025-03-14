import { ExamDone } from '../pages/ExamDone';
import { ExamChecking } from '../pages/ExamPages/ExamChecking';
import { ExamConsulting } from '../pages/ExamPages/ExamConsulting';
import { ExamPreviewing } from '../pages/ExamPages/ExamPreviewing';
import { ExamTaking } from '../pages/ExamPages/ExamTaking';
import { ExamResults } from '../pages/ExamResults';
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
import { ExamEditingContent } from '../pages/ExamPages/ExamEditingContent';
import { AttemptNotCorrected } from '../pages/AttemptNotCorrected';
import { ExamParameters } from '../pages/ExamParameters';
import { ExamCollect } from '../pages/ExamCollect';
import { ExamConsult } from '../pages/ExamConsult';
import { StudentRegistration } from '../pages/StudentRegistration';
import { NotFound } from '../pages/NotFound';
import { StudentAuthenticationExamTakingRedirection } from '../pages/StudentAuthenticationExamTakingRedirection';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminTeacherExams } from '../pages/AdminTeacherExams';
import { userRoleType } from '../constants';
import { TeacherHome } from '../pages/TeacherHome';
import { Establishment } from '../pages/Establishment';
import { Classe } from '../pages/Classe';
import { Onboarding } from '../pages/Onboarding';
import { Privacy } from '../pages/Home/Privacy/Privacy';
import { LegalNotice } from '../pages/Home/LegalNotice/LegalNotice';
import { FAQ } from '../pages/Home/FAQ/FAQ';
import { Pricing } from '../pages/Home/Pricing/Pricing';
import { Product } from '../pages/Home/Product/Product';
import { SignUp } from '../pages/SignUp';
import { TermsAndConditionsOfSale } from '../pages/Home/TermsAndConditionsOfSale/TermsAndConditionsOfSale';
import { PaymentStart } from '../pages/Payment/PaymentStart';
import { PaymentFailure } from '../pages/Payment/PaymentFailure';
import { PaymentSuccess } from '../pages/Payment/PaymentSuccess';
import { PaymentConfirmed } from '../pages/Payment/PaymentConfirmed';
import { Profile } from '../pages/Profile/Profile';

const ROUTE_ELEMENTS: Record<
    (typeof ROUTE_KEYS)[number],
    { element: JSX.Element; authorizedRole?: userRoleType }
> = {
    PRIVACY: { element: <Home ContentComponent={<Privacy />} /> },
    LEGAL_NOTICE: { element: <Home ContentComponent={<LegalNotice />} /> },
    FAQ: { element: <Home ContentComponent={<FAQ />} /> },
    EXAM_TAKING: {
        element: <ExamTaking />,
    },
    EXAM_EDITING_CONTENT: {
        authorizedRole: 'teacher',
        element: <ExamEditingContent />,
    },
    EXAM_PARAMETERS: {
        authorizedRole: 'teacher',
        element: <ExamParameters />,
    },
    EXAM_ATTEMPT_COLLECT: {
        authorizedRole: 'teacher',
        element: <ExamCollect />,
    },
    EXAM_RESULTS: {
        authorizedRole: 'teacher',
        element: <ExamResults />,
    },
    EXAM_CONSULT: {
        authorizedRole: 'teacher',
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
        element: <SignIn title="Se connecter" />,
    },
    SIGN_UP: {
        element: <SignUp title="Créer un compte" />,
    },
    HOME: {
        element: <Home ContentComponent={<Product />} />,
    },
    EXAM_CONSULTING: {
        element: <ExamConsulting />,
    },
    EXAM_DONE: {
        element: <ExamDone />,
    },
    CLASSE: {
        authorizedRole: 'teacher',
        element: <Classe />,
    },
    STUDENTS: { authorizedRole: 'teacher', element: <Students /> },
    PROFILE: { authorizedRole: 'teacher', element: <Profile /> },
    EXAM_PREVIEWING: {
        element: <ExamPreviewing />,
    },
    EXAM_CHECKING: {
        authorizedRole: 'teacher',

        element: <ExamChecking />,
    },
    TEACHER_HOME: {
        authorizedRole: 'teacher',
        element: <TeacherHome />,
    },
    ESTABLISHMENT: { authorizedRole: 'teacher', element: <Establishment /> },
    ATTEMPT_NOT_CORRECTED: { element: <AttemptNotCorrected /> },
    STUDENT_AUTHENTICATION_EXAM_TAKING_SHORTENED: {
        element: <StudentAuthenticationExamTakingRedirection />,
    },
    NOT_FOUND: { element: <NotFound /> },
    ADMIN_DASHBOARD: { element: <AdminDashboard />, authorizedRole: 'admin' },
    ADMIN_TEACHER_EXAMS: { element: <AdminTeacherExams />, authorizedRole: 'admin' },
    ONBOARDING: { element: <Onboarding />, authorizedRole: 'teacher' },
    PRICING: { element: <Home ContentComponent={<Pricing />} /> },
    PRODUCT: { element: <Home ContentComponent={<Product />} /> },
    TERMS_AND_CONDITIONS_OF_SALE: {
        element: <Home ContentComponent={<TermsAndConditionsOfSale />} />,
    },
    PAYMENT_START: {
        authorizedRole: 'teacher',
        element: <PaymentStart />,
    },
    PAYMENT_FAILURE: {
        authorizedRole: 'teacher',
        element: <PaymentFailure />,
    },
    PAYMENT_SUCCESS: {
        authorizedRole: 'teacher',
        element: <PaymentSuccess />,
    },
    PAYMENT_CONFIRMED: {
        authorizedRole: 'teacher',
        element: <PaymentConfirmed />,
    },
};

export { ROUTE_ELEMENTS };
