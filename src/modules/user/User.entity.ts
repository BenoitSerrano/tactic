import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from '../plan';
import { UserConfiguration } from '../userConfiguration';
import { userRoleType } from './constants';
import { Exam } from '../exam';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

    @Column('simple-array', { default: 'teacher' })
    roles: userRoleType[];

    @ManyToOne(() => Plan, { nullable: false })
    plan: Plan;

    @OneToOne(() => UserConfiguration, (userConfiguration) => userConfiguration.user, {
        nullable: false,
    })
    @JoinColumn()
    userConfiguration: UserConfiguration;

    @OneToMany(() => Exam, (exam) => exam.user)
    exams: Exam[];
}
