import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';

@Entity()
export class PaymentSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    stripeCheckoutSessionId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;
}
