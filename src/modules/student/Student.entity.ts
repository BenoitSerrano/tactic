import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { StudentInterface } from './student.interface';
import { AttemptInterface } from '../attempt/attempt.interface';
import { User } from '../user';
import { Group } from '../group';

@Entity()
@Unique('Students are unique by teacher', ['email', 'user'])
export class Student implements StudentInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    email: string;

    @Column({ nullable: true })
    comment?: string;

    @OneToMany('Attempt', 'student')
    attempts: AttemptInterface[];

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: false })
    group: Group;

    @CreateDateColumn()
    createdDate: string;
}
