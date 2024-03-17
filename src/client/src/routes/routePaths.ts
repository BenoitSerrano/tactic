import { ROUTE_KEYS } from './routeKeys';

const ROUTE_PATHS: Record<(typeof ROUTE_KEYS)[number], { path: string }> = {
    EXAM_TAKING: {
        path: '/student/students/:studentId/attempts/:attemptId/take',
    },
    EXAM_CONSULTING: {
        path: '/student/students/:studentId/attempts/:attemptId/consult',
    },
    EXAM_EDITING_CONTENT: {
        path: '/teacher/exams/:examId/edit/content',
    },
    EXAM_EDITING_PARAMETERS: {
        path: '/teacher/exams/:examId/edit/parameters',
    },
    EXAM_EDITING_COLLECT: {
        path: '/teacher/exams/:examId/edit/collect',
    },
    EXAM_EDITING_RESULTS: {
        path: '/teacher/exams/:examId/edit/results',
    },
    EXAM_EDITING_CONSULT: {
        path: '/teacher/exams/:examId/edit/consult',
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
        path: '/student/students/:studentId/exam-done',
    },
    EXAM_ARCHIVED: {
        path: '/student/exam-archived',
    },
    EXAM_LIST: { path: `/teacher/exams` },
    EXAM_LIST_ARCHIVED: { path: `/teacher/exams/archived` },
    EXAM_LIST_CURRENT: { path: `/teacher/exams/current` },
    STUDENTS: { path: `/teacher/groups/:groupId/students` },
    EXAM_RESULTS: {
        path: `/teacher/exams/:examId/results`,
    },
    EXAM_PREVIEWING: {
        path: `/teacher/exams/:examId/preview`,
    },
    EXAM_CHECKING: {
        path: `/teacher/exams/:examId/results/:attemptId`,
    },
    GROUPS: {
        path: `/teacher/groups`,
    },
    TEACHER_HOME: { path: `/teacher` },
    ATTEMPT_NOT_CORRECTED: { path: `/student/attempt-not-corrected` },
};

export { ROUTE_PATHS };
