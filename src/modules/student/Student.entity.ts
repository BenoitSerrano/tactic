import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attempt } from '../attempt/Attempt.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @CreateDateColumn()
    startedAt: number;

    @OneToMany(() => Attempt, (attempt) => attempt.student)
    attempts: Attempt[];
}
