import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attempt } from '../attempt';
import { User } from '../user';
import { Question } from '../question';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    user?: User;

    @OneToMany(() => Question, (question) => question.exam)
    questions: Question[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];

    @Column({ default: 15 })
    duration: number;

    @Column({ default: 2 })
    extraTime: number;
}
