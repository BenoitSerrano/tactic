import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from '../exam';

@Entity()
export class QuestionTrou {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    beforeText: string;

    @Column()
    afterText: string;

    @Column('int', { default: 1 })
    points: number;

    @Column('simple-array', { default: '' })
    acceptableAnswers: string[];

    @Column('simple-array', { default: '' })
    rightAnswers: string[];

    @Column('int')
    order: number;

    @ManyToOne(() => Exam, (exam) => exam.questionsTrou)
    exam: Exam;
}
