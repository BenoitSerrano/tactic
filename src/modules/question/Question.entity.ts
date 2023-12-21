import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { questionKindType, questionKinds } from './types';
import { Exercise } from '../exercise';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('enum', { enum: questionKinds })
    kind: questionKindType;

    @Column()
    title: string;

    @Column('float')
    points: number;

    // Nouveau format décodé tàt : [[2:tu es|t'es, 1.5:tou es], [2:la, 0.5: là]]
    // Nouveau format décodé autres : [2:tu es la plus belle, 2:|t'es la plus belle, 1.5:es-tu la plus belle]
    // nouveau format parsed Tàt :

    @Column('simple-array', { default: '' })
    acceptableAnswersWithPoints: string[];

    @Column('int')
    order: number;

    @Column('simple-array', { default: '' })
    possibleAnswers: string[];

    @ManyToOne(() => Exercise, { onDelete: 'CASCADE', nullable: false })
    exercise: Exercise;
}

// const tatAcceptableAnswers = [
//     [
//         { points: 2, answer: 'tu es' },
//         { points: 1.5, answer: "t'es" },
//     ],
//     [
//         { points: 2, answer: 'plus' },
//         { points: 1, answer: 'plous' },
//     ],
// ];

// const otherAcceptableAnswers = [
//     { points: 2, answer: 'sûre' },
//     { points: 2, answer: "certaine" },
//     { points: 1.5, answer: "bof" },
// ];

// const stringifyedTat = `2:tu es|1.5:t'es,2:plus|1:plous`;
// const stringifyedOther = `2:sûre,2:certaine,1.5:bof`;
