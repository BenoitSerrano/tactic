import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from '../exam';

@Entity()
export class QuestionChoixMultiple {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('simple-array')
    possibleAnswers: string[];

    @Column('int')
    rightAnswerIndex: number;

    @Column('float', { default: 1.0 })
    points: number;

    @Column('int')
    order: number;

    @ManyToOne(() => Exam, (exam) => exam.questionsChoixMultiple, { onDelete: 'CASCADE' })
    exam: Exam;
}
