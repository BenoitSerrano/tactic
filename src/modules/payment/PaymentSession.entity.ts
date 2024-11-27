import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user';
import { Package } from '../package';
import { paymentSessionStatuses, paymentSessionStatusType } from './types';

@Entity()
export class PaymentSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    stripeCheckoutSessionId: string;

    @ManyToOne(() => Package, { onDelete: 'CASCADE', nullable: false })
    package: Package;

    @Column('enum', { enum: paymentSessionStatuses })
    status: paymentSessionStatusType;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    user: User;
}
