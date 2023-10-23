import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exam } from '../exam';
import { questionKindType, questionKinds } from './types';
import { Exercise } from '../exercise';

@Entity()
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

    @Column('simple-array', { default: '' })
    possibleAnswers: string[];

    @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
    exam: Exam;

    @ManyToOne(() => Exercise, { onDelete: 'CASCADE', nullable: true })
    exercise: Exercise;
}
