import Joi from 'joi';
import { buildStudentController } from '../modules/student';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const studentController = buildStudentController();

const studentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/groups/:groupId/students',
        isAuthenticated: true,
        controller: studentController.getStudentsWithAttempts,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    },
    {
        method: 'GET',
        path: '/all-students',
        isAuthenticated: false,
        controller: studentController.getAllStudents,
    },
    {
        method: 'GET',
        path: '/students/:studentId',
        isAuthenticated: false,
        controller: studentController.getStudent,
    },
    {
        method: 'PATCH',
        path: '/students/:studentId/names',
        isAuthenticated: false,
        controller: studentController.updateStudentNames,
        schema: Joi.object({ firstName: Joi.string(), lastName: Joi.string() }),
    },
    {
        method: 'GET',
        path: '/exams/:examId/students/:email',
        isAuthenticated: false,
        controller: studentController.fetchStudentByEmailForExam,
    },
    {
        method: 'POST',
        path: '/groups/:groupId/students',
        isAuthenticated: true,
        controller: studentController.createStudents,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    },
    {
        method: 'PATCH',
        path: '/groups/:groupId/students/:studentId/new-group/:newGroupId',
        isAuthenticated: true,
        controller: studentController.changeGroup,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'group', key: 'groupId' },
            { entity: 'group', key: 'newGroupId' },
        ]),
    },
    {
        method: 'DELETE',
        path: '/groups/:groupId/students/:studentId',
        isAuthenticated: true,
        controller: studentController.deleteStudent,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'group', key: 'groupId' },
        ]),
    },
];

export { studentRoutes };
