import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Attempt } from '../attempt';
import { QuestionTrou } from '../questionTrou/QuestionTrou.entity';

@Entity()
@Unique('One answer corresponds to one questionTrou and one attempt', ['questionTrou', 'attempt'])
export class QuestionTrouAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    answer: string;

    @ManyToOne(() => QuestionTrou)
    questionTrou: QuestionTrou;

    @ManyToOne(() => Attempt)
    attempt: Attempt;
}
