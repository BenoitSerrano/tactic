import { dataSource } from '../../dataSource';
import { Student } from './Student.entity';

export { buildStudentService };

function buildStudentService() {
    const studentService = {
        createStudent,
        getStudents,
    };

    return studentService;

    async function getStudents() {
        const studentRepository = dataSource.getRepository(Student);
        return studentRepository.find();
    }

    async function createStudent(firstName: string, lastName: string) {
        const studentRepository = dataSource.getRepository(Student);
        const student = new Student();
        student.firstName = firstName;
        student.lastName = lastName;
        return studentRepository.save(student);
    }
}
