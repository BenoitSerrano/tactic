import { ROUTE_KEYS } from './routeKeys';

const ROUTE_PATHS: Record<(typeof ROUTE_KEYS)[number], { path: string }> = {
    EXAM_TAKING: {
        path: '/student/students/:studentId/attempts/:attemptId/take',
    },
    STUDENT_HOME: {
        path: '/student/exams/:examId/students/:studentId',
    },
    STUDENT_AUTHENTICATION: {
        path: '/student/exams/:examId',
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
    EXAM_CONSULTING: {
        path: '/student/students/:studentId/attempts/:attemptId/consult',
    },
    EXAM_DONE: {
        path: '/student/students/:studentId/exam-done',
    },
    EXAMS: { path: `/teacher/exams` },
    STUDENTS: { path: `/teacher/groups/:groupId/students` },
    EXAM_EXERCISES: {
        path: `/teacher/exams/:examId/exercises`,
    },
    EXAM_QUESTIONS_EDITION: {
        path: `/teacher/exams/:examId/exercises/:exerciseId`,
    },
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
};

export { ROUTE_PATHS };
