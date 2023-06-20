import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { Attempt } from '../attempt';
import { TexteTrou } from '../texteTrou/TexteTrou.entity';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => QuestionChoixMultiple, (questionChoixMultiple) => questionChoixMultiple.exam)
    questionsChoixMultiple: QuestionChoixMultiple[];

    @OneToMany(() => TexteTrou, (texteTrou) => texteTrou.exam)
    textesTrou: TexteTrou[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];

    @Column({ default: 15 })
    duration: number;

    @Column({ default: 2 })
    extraTime: number;
}
