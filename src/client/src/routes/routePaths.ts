import { ROUTE_KEYS } from './routeKeys';

const ROUTE_PATHS: Record<(typeof ROUTE_KEYS)[number], { path: string }> = {
    EXAM_TAKING: {
        path: '/student/students/:studentId/attempts/:attemptId/take',
    },
    EXAM_CONSULTING: {
        path: '/student/students/:studentId/attempts/:attemptId/consult',
    },
    EXAM_EDITING_CONTENT: {
        path: '/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/edit/content',
    },
    EXAM_PARAMETERS: {
        path: '/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/edit/parameters',
    },
    EXAM_ATTEMPT_COLLECT: {
        path: '/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/edit/collect',
    },
    EXAM_RESULTS: {
        path: '/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/edit/results',
    },
    EXAM_CONSULT: {
        path: '/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/edit/consult',
    },
    STUDENT_REGISTRATION: {
        path: '/student/exams/:examId/students/:studentId/:encodedAction/register',
    },
    STUDENT_HOME: {
        path: '/student/exams/:examId/students/:studentId/:encodedAction',
    },
    STUDENT_AUTHENTICATION: {
        path: '/student/exams/:examId/:encodedAction',
    },
    RESET_PASSWORD_FAILURE: {
        path: '/reset-password-failure',
    },
    RESET_PASSWORD_SUCCESS: {
        path: '/reset-password-success',
    },
    RESET_PASSWORD_REQUESTED: {
        path: '/reset-password-requested',
    },
    RESET_PASSWORD: {
        path: '/reset-password',
    },
    REQUEST_RESET_PASSWORD: {
        path: '/request-reset-password',
    },
    SIGN_IN: {
        path: '/sign-in',
    },
    SIGN_UP: {
        path: '/sign-up',
    },
    HOME: {
        path: '/',
    },
    EXAM_DONE: {
        path: '/student/exams/:examId/exam-done',
    },
    CLASSE: {
        path: `/teacher/establishments/:establishmentId/classes/:classeId`,
    },
    ONBOARDING: { path: `/teacher/onboarding` },
    STUDENTS: { path: `/teacher/establishments/:establishmentId/classes/:classeId/students` },
    EXAM_PREVIEWING: {
        path: `/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/preview`,
    },
    EXAM_CHECKING: {
        path: `/teacher/establishments/:establishmentId/classes/:classeId/exams/:examId/results/:attemptId`,
    },
    ESTABLISHMENT: {
        path: `/teacher/establishments/:establishmentId`,
    },
    TEACHER_HOME: { path: `/teacher` },
    ATTEMPT_NOT_CORRECTED: { path: `/student/attempt-not-corrected` },
    ADMIN_TEACHER_EXAMS: { path: `/admin/teachers/:userId/exams` },
    ADMIN_DASHBOARD: { path: `/admin` },
    STUDENT_AUTHENTICATION_EXAM_TAKING_SHORTENED: { path: `/t/:examId` },
    FAQ: { path: '/faq' },
    PRIVACY: { path: '/privacy' },
    TERMS_AND_CONDITIONS: { path: '/terms-and-conditions' },
    PRICING: { path: '/pricing' },
    PRODUCT: { path: '/product' },
    NOT_FOUND: { path: '/*' },
};

export { ROUTE_PATHS };
