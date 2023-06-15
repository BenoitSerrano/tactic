import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../student/Student.entity';
import { Exam } from '../exam';
import { QcmAnswer } from '../qcmAnswer';

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

    @OneToMany(() => QcmAnswer, (qcmAnswer) => qcmAnswer.attempt)
    qcmAnswers: QcmAnswer[];
}
