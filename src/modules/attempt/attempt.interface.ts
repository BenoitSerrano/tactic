import { Exam } from '../exam';
import { PhraseMelangeeAnswer } from '../phraseMelangeeAnswer';
import { QcmAnswer } from '../qcmAnswer';
import { QuestionTrouAnswer } from '../questionTrouAnswer';

export interface AttemptInterface {
    id: string;

    startedAt: string;

    updatedAt: string;

    hasBeenTreated: boolean;

    exam: Exam;

    qcmAnswers: QcmAnswer[];

    questionTrouAnswers: QuestionTrouAnswer[];

    phraseMelangeAnswers: PhraseMelangeeAnswer[];
}
