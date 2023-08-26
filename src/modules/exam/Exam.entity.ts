import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { Attempt } from '../attempt';
import { QuestionTrou } from '../questionTrou';
import { PhraseMelangee } from '../phraseMelangee';
import { User } from '../user';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
    user?: User;

    @OneToMany(() => QuestionChoixMultiple, (questionChoixMultiple) => questionChoixMultiple.exam)
    questionsChoixMultiple: QuestionChoixMultiple[];

    @OneToMany(() => QuestionTrou, (questionTrou) => questionTrou.exam)
    questionsTrou: QuestionTrou[];

    @OneToMany(() => PhraseMelangee, (phraseMelangee) => phraseMelangee.exam)
    phrasesMelangees: PhraseMelangee[];

    @OneToMany(() => Attempt, (attempt) => attempt.exam)
    attempts: Attempt[];

    @Column({ default: 15 })
    duration: number;

    @Column({ default: 2 })
    extraTime: number;
}
