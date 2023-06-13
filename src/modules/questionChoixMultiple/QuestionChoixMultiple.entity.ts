import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionChoixMultiple {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('int')
    order: number;

    @Column('simple-array')
    possibleAnswers: string[];

    @Column('int')
    rightAnswerIndex: number;
}
