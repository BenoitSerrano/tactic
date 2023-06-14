import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from '../exam';

@Entity()
export class QuestionChoixMultiple {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('int')
    order: number;

    @Column('simple-array')
    possibleAnswers: string[];

    @Column('int')
    rightAnswerIndex: number;

    @ManyToOne(() => Exam, (exam) => exam.questionsChoixMultiple)
    exam: Exam;
}
