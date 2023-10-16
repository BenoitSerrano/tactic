import { Exam } from '../exam';

export interface AttemptInterface {
    id: string;

    startedAt: string;

    updatedAt: string;

    hasBeenTreated: boolean;

    exam: Exam;
}
