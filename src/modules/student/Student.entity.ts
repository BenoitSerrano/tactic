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
import { Classe } from '../classe';

@Entity()
@Unique('Students are unique by classe', ['email', 'classe'])
export class Student implements StudentInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    email: string;

    @Column({ default: '' })
    firstName: string;

    @Column({ default: '' })
    lastName: string;

    @OneToMany('Attempt', 'student')
    attempts: AttemptInterface[];

    @ManyToOne(() => Classe, { onDelete: 'CASCADE', nullable: false })
    classe: Classe;

    @CreateDateColumn()
    createdDate: string;
}
