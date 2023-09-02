import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { AttemptInterface } from './attempt.interface';
import { Exam } from '../exam';
import { QcmAnswer } from '../qcmAnswer';
import { QuestionTrouAnswer } from '../questionTrouAnswer';
import { PhraseMelangeeAnswer } from '../phraseMelangeeAnswer';
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

    @OneToMany(() => QcmAnswer, (qcmAnswer) => qcmAnswer.attempt)
    qcmAnswers: QcmAnswer[];

    @OneToMany(() => QuestionTrouAnswer, (questionTrouAnswer) => questionTrouAnswer.attempt)
    questionTrouAnswers: QuestionTrouAnswer[];

    @OneToMany(() => PhraseMelangeeAnswer, (phraseMelangeAnswer) => phraseMelangeAnswer.attempt)
    phraseMelangeAnswers: PhraseMelangeeAnswer[];

    @Column({ default: 0 })
    roundTrips: number;

    @Column({ default: 0 })
    timeSpentOutside: number;
}
