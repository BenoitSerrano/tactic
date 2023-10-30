import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { questionKindType, questionKinds } from './types';
import { Exercise } from '../exercise';

@Entity()
@Unique('Order is unique for each question of an exercise', ['order', 'exercise'])
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

    @ManyToOne(() => Exercise, { onDelete: 'CASCADE' })
    exercise: Exercise;
}
