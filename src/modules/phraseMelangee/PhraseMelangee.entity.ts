import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from '../exam';

@Entity()
export class PhraseMelangee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('simple-array')
    words: string[];

    @Column('simple-array')
    shuffledCombination: string[];

    @Column('int')
    order: number;

    @Column('float', { default: 1.0 })
    points: number;

    @ManyToOne(() => Exam, (exam) => exam.phrasesMelangees)
    exam: Exam;
}
