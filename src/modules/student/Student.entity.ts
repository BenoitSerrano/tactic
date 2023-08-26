import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentInterface } from './student.interface';
import { AttemptInterface } from '../attempt/attempt.interface';
import { User } from '../user';

@Entity()
export class Student implements StudentInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '', unique: true })
    email: string;

    @Column({ nullable: true })
    comment?: string;

    @OneToMany('Attempt', 'student')
    attempts: AttemptInterface[];

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    user?: User;
}
