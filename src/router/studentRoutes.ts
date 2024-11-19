import Joi from 'joi';
import { buildStudentController } from '../modules/student';
import { routeType } from './types';
import { accessControlBuilder } from './lib/accessControlBuilder';

const studentController = buildStudentController();

const studentRoutes: Array<routeType<any, any, any>> = [
    {
        method: 'GET',
        path: '/classes/:classeId/students/with-attempts',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.getStudentsWithAttempts,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
        ]),
    },
    {
        method: 'GET',
        path: '/classes/:classeId/students-count',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.countStudentByClasse,
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
        controller: studentController.getStudentByEmailForExam,
    },
    {
        method: 'POST',
        path: '/classes/:classeId/students',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.createStudents,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
        ]),
        schema: Joi.object({
            emails: Joi.array().items(Joi.string()),
        }),
    },
    {
        method: 'PATCH',
        path: '/classes/:classeId/students/:studentId/new-classe/:newClasseId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.updateStudentClasse,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
            { entity: 'classe', key: 'newClasseId' },
        ]),
    },
    {
        method: 'DELETE',
        path: '/classes/:classeId/students/:studentId',
        kind: 'authenticated',
        authorizedRoles: ['teacher'],
        controller: studentController.deleteStudent,
        checkAuthorization: accessControlBuilder.assertHasAccessToResources([
            { entity: 'classe', key: 'classeId' },
        ]),
    },
];

export { studentRoutes };
