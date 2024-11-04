import Joi from 'joi';
import { buildStudentController } from '../modules/student';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const studentController = buildStudentController();

const studentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/groups/:groupId/students',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.getStudentsWithAttempts,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'groupId' },
        ]),
    },
    {
        method: 'GET',
        path: '/all-students',
        kind: 'public',
        controller: studentController.getAllStudents,
    },
    {
        method: 'GET',
        path: '/students/:studentId',
        kind: 'public',
        controller: studentController.getStudent,
    },
    {
        method: 'PATCH',
        path: '/students/:studentId/names',
        kind: 'public',
        controller: studentController.updateStudentNames,
        schema: Joi.object({ firstName: Joi.string(), lastName: Joi.string() }),
    },
    {
        method: 'GET',
        path: '/exams/:examId/students/:email',
        kind: 'public',
        controller: studentController.fetchStudentByEmailForExam,
    },
    {
        method: 'POST',
        path: '/groups/:groupId/students',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.createStudents,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'groupId' },
        ]),
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    },
    {
        method: 'PATCH',
        path: '/groups/:groupId/students/:studentId/new-group/:newGroupId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.changeGroup,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'groupId' },
            { entity: 'classe', key: 'newGroupId' },
        ]),
    },
    {
        method: 'DELETE',
        path: '/groups/:groupId/students/:studentId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.deleteStudent,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'groupId' },
        ]),
    },
];

export { studentRoutes };
