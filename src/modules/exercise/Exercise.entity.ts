import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exam } from '../exam';
import { Question } from '../question';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    instruction: string;

    @Column('float', { default: 1 })
    defaultPoints: number;

    @Column('int')
    order: number;

    @ManyToOne(() => Exam, (exam) => exam.exercises, { onDelete: 'CASCADE' })
    exam: Exam;

    @OneToMany(() => Question, (question) => question.exercise)
    questions: Question[];
}
