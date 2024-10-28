import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from '../exam';
import { Question } from '../question';
import { questionKindType, questionKinds } from '../question/types';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    instruction: string;

    @Column('float', { nullable: true })
    defaultPoints: number | null;

    @Column('float')
    order: number;

    @Column('enum', { enum: questionKinds })
    defaultQuestionKind: questionKindType;

    @ManyToOne(() => Exam, (exam) => exam.exercises, { onDelete: 'CASCADE', nullable: false })
    exam: Exam;

    @OneToMany(() => Question, (question) => question.exercise)
    questions: Question[];
}
