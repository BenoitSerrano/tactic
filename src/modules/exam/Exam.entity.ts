import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { Attempt } from '../attempt';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => QuestionChoixMultiple, (questionChoixMultiple) => questionChoixMultiple.exam)
    questionsChoixMultiple: QuestionChoixMultiple[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];
}
