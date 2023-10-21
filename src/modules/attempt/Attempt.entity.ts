import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { AttemptInterface } from './attempt.interface';
import { Exam } from '../exam';
import { StudentInterface } from '../student/student.interface';

@Entity()
@Unique('One student has one shot for an exam', ['student', 'exam'])
export class Attempt implements AttemptInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    startedAt: string;

    @Column({ type: 'timestamptz', nullable: true })
    updatedAt: string;

    @Column({ default: false })
    hasBeenTreated: boolean;

    @ManyToOne('Student', { onDelete: 'CASCADE' })
    student: StudentInterface;

    @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
    exam: Exam;

    @Column({ default: 0 })
    roundTrips: number;

    @Column({ default: 0 })
    timeSpentOutside: number;

    @Column('simple-array', { default: '' })
    answers: string[];

    @Column({ default: '' })
    marks: string;
}
