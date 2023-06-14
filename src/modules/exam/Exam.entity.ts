import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionChoixMultiple } from '../questionChoixMultiple';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => QuestionChoixMultiple, (questionChoixMultiple) => questionChoixMultiple.exam)
    questionsChoixMultiple: QuestionChoixMultiple[];
}
