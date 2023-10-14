import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exam } from '../exam';
import { questionKindType, questionKinds } from './types';

@Entity()
@Unique('The order for a question is unique inside an exam', ['order', 'exam'])
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('enum', { enum: questionKinds })
    kind: questionKindType;

    @Column()
    title: string;

    @Column('float')
    points: number;

    @Column('simple-array', { default: '' })
    acceptableAnswers: string[];

    @Column('simple-array', { default: '' })
    rightAnswers: string[];

    @Column('int')
    order: number;

    @Column('simple-array', { nullable: true })
    possibleAnswers?: string[];

    @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
    exam: Exam;
}
