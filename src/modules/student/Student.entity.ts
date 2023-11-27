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
import { Group } from '../group';

@Entity()
@Unique('Students are unique by group', ['email', 'group'])
export class Student implements StudentInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    email: string;

    @OneToMany('Attempt', 'student')
    attempts: AttemptInterface[];

    @ManyToOne(() => Group, { onDelete: 'CASCADE', nullable: false })
    group: Group;

    @CreateDateColumn()
    createdDate: string;
}
