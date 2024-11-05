import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';
import { Establishment } from '../establishment';

@Entity()
export class Classe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;

    @ManyToOne(() => Establishment, { onDelete: 'CASCADE', nullable: true })
    establishment: Establishment;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: string;
}
