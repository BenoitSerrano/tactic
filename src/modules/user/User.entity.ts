import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from '../plan';
import { UserConfiguration } from '../userConfiguration';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hashedPassword: string;

    @ManyToOne(() => Plan, { nullable: false })
    plan: Plan;

    @OneToOne(() => UserConfiguration, (userConfiguration) => userConfiguration.user, {
        nullable: false,
    })
    @JoinColumn()
    userConfiguration: UserConfiguration;
}
