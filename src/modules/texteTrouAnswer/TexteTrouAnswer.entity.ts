import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Attempt } from '../attempt';
import { TexteTrou } from '../texteTrou/TexteTrou.entity';

@Entity()
@Unique('One answer corresponds to one texteTrou and one attempt', ['texteTrou', 'attempt'])
export class TexteTrouAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    choice: number;

    @ManyToOne(() => TexteTrou)
    texteTrou: TexteTrou;

    @ManyToOne(() => Attempt)
    attempt: Attempt;
}
