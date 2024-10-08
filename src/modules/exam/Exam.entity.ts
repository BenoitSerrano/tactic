import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Attempt } from '../attempt';
import { User } from '../user';
import { Exercise } from '../exercise';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;

    @OneToMany(() => Exercise, (exercise) => exercise.exam)
    exercises: Exercise[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];

    @Column({ type: 'int', nullable: true })
    duration: number | null;

    @Column({ default: 2 })
    extraTime: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: string;

    @Column({ type: 'timestamptz', nullable: true })
    archivedAt: string | null;

    @Column({ default: false })
    shouldDisplayRightAnswers: boolean;

    @Column({ type: 'text' })
    startText: string;

    @Column({ type: 'text' })
    endText: string;
}
