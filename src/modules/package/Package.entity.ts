import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    price: number;

    @Column({ type: 'smallint' })
    paperCount: number;

    @Column()
    stripeProductId: string;

    @Column()
    stripePriceId: string;
}
