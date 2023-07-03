import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Student } from '../student/Student.entity';
import { Exam } from '../exam';
import { QcmAnswer } from '../qcmAnswer';
import { QuestionTrouAnswer } from '../questionTrouAnswer';

@Entity()
@Unique('One student has one shot for an exam', ['student', 'exam'])
export class Attempt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    startedAt: string;

    @Column({ type: 'timestamptz', nullable: true })
    endedAt: string;

    @ManyToOne(() => Student, { onDelete: 'CASCADE' })
    student: Student;

    @ManyToOne(() => Exam)
    exam: Exam;

    @OneToMany(() => QcmAnswer, (qcmAnswer) => qcmAnswer.attempt)
    qcmAnswers: QcmAnswer[];

    @OneToMany(() => QuestionTrouAnswer, (questionTrouAnswer) => questionTrouAnswer.attempt)
    questionTrouAnswers: QuestionTrouAnswer[];
}
