import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../student/Student.entity';
import { Exam } from '../exam';

@Entity()
export class Attempt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: number;

    @ManyToOne(() => Student)
    student: Student;

    @ManyToOne(() => Exam)
    exam: Exam;
}
