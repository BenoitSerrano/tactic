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
import { USER_ROLES, userRoleType } from './constants';
import { Exam } from '../exam';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

    @Column('enum', { enum: USER_ROLES, default: 'teacher' as userRoleType })
    role: userRoleType;

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
