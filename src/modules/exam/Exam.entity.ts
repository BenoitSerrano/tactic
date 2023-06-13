import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
