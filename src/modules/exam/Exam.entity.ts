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
import { Classe } from '../classe';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;

    @ManyToOne(() => Classe, { onDelete: 'CASCADE', nullable: false })
    classe: Classe;

    @OneToMany(() => Exercise, (exercise) => exercise.exam)
    exercises: Exercise[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];

    // Duration in minutes
    @Column({ type: 'int', nullable: true })
    duration: number | null;

    @Column({ type: 'timestamptz', nullable: false })
    startTime: string;

    @Column({ type: 'timestamptz', nullable: true })
    endTime: string;

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
