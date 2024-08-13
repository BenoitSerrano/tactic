import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plan } from '../plan';

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
}
