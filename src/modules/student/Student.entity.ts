import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attempt } from '../attempt/Attempt.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    email: string;

    @Column({ nullable: true })
    comment?: string;

    @OneToMany(() => Attempt, (attempt) => attempt.student)
    attempts: Attempt[];
}
