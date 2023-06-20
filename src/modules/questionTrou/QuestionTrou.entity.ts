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

    @Column('simple-array')
    acceptableAnswers: string[];

    @Column()
    rightAnswer: string;

    @Column('int')
    order: number;

    @ManyToOne(() => Exam, (exam) => exam.questionsTrou)
    exam: Exam;
}
