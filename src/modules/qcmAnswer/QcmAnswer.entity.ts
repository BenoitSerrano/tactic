import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { Attempt } from '../attempt';

@Entity()
export class QcmAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    choice: number;

    @ManyToOne(() => QuestionChoixMultiple)
    questionChoixMultiple: QuestionChoixMultiple;

    @ManyToOne(() => Attempt)
    attempt: Attempt;
}
