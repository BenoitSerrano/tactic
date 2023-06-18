import { dataSource } from '../../dataSource';
import { Student } from './Student.entity';

export { buildStudentService };

function buildStudentService() {
    const studentService = {
        createStudent,
        getStudentsWithAttempts,
    };

    return studentService;

    async function getStudentsWithAttempts() {
        const studentRepository = dataSource.getRepository(Student);
        return studentRepository.find({ relations: ['attempts', 'attempts.exam'] });
    }

    async function createStudent(email: string) {
        const studentRepository = dataSource.getRepository(Student);
        const student = new Student();
        student.email = email;
        return studentRepository.save(student);
    }
}
