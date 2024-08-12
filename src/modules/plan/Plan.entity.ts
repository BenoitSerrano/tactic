import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PLAN_NAMES, planNameType } from './types';

@Entity()
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('enum', { enum: PLAN_NAMES, unique: true })
    name: planNameType;

    @Column({ type: 'smallint' })
    monthlyPrice: number;

    @Column({ type: 'smallint' })
    annualPrice: number;

    @Column({ type: 'smallint', nullable: true })
    maxAttempts?: number;

    @Column({ type: 'smallint', nullable: true })
    maxExams?: number;
}
