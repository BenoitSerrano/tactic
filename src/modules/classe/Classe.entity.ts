import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user';
import { Establishment } from '../establishment';
import { Exam } from '../exam';

@Entity()
export class Classe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;

    @ManyToOne(() => Establishment, { onDelete: 'CASCADE', nullable: true })
    establishment: Establishment;

    @OneToMany(() => Exam, (exam) => exam.classe)
    exams: Exam[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: string;
}
