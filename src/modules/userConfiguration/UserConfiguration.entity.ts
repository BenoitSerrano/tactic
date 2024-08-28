import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { defaultEndText, defaultStartText } from './constants';

@Entity()
export class UserConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false, default: defaultStartText })
    defaultStartText: string;

    @Column({ type: 'text', nullable: false, default: defaultEndText })
    defaultEndText: string;
}
