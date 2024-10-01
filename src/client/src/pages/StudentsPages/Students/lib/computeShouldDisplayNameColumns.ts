import { studentsSummaryType } from '../types';

function computeShouldDisplayNameColumns(studentsSummary: studentsSummaryType): boolean {
    const doesAnyStudentHasName = studentsSummary.students.some(
        (student) => student.firstName !== '' || student.lastName !== '',
    );
    return doesAnyStudentHasName;
}

export { computeShouldDisplayNameColumns };
