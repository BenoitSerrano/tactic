import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { defaultEndText, defaultStartText } from './constants';
import { User } from '../user/User.entity';

@Entity()
export class UserConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false, default: defaultStartText })
    defaultStartText: string;

    @Column({ type: 'text', nullable: false, default: defaultEndText })
    defaultEndText: string;

    @OneToOne(() => User, (user) => user.userConfiguration)
    user: User;
}
