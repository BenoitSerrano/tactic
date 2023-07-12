import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Attempt } from '../attempt';
import { PhraseMelangee } from '../phraseMelangee';

@Entity()
@Unique('One combination corresponds to one phraseMelangee and one attempt', [
    'phraseMelangee',
    'attempt',
])
export class PhraseMelangeeAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answer: string;

    @ManyToOne(() => PhraseMelangee)
    phraseMelangee: PhraseMelangee;

    @ManyToOne(() => Attempt, { onDelete: 'CASCADE' })
    attempt: Attempt;
}
