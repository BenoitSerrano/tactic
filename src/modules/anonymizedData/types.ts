import { Attempt } from '../attempt';
import { Exam } from '../exam';
import { PhraseMelangee } from '../phraseMelangee';
import { PhraseMelangeeAnswer } from '../phraseMelangeeAnswer';
import { QcmAnswer } from '../qcmAnswer';
import { QuestionChoixMultiple } from '../questionChoixMultiple';
import { QuestionTrou } from '../questionTrou';
import { QuestionTrouAnswer } from '../questionTrouAnswer';
import { Student } from '../student';
import { User } from '../user';

type anonymizedDataType = {
    students: Record<Student['id'], Student>;
    exams: Record<Exam['id'], Exam>;
    questionsTrou: Record<QuestionTrou['id'], QuestionTrou>;
    questionsChoixMultiple: Record<QuestionChoixMultiple['id'], QuestionChoixMultiple>;
    phrasesMelangees: Record<PhraseMelangee['id'], PhraseMelangee>;
    attempts: Record<Attempt['id'], Attempt>;
    users: Record<User['id'], User>;
    qcmAnswers: Record<QcmAnswer['id'], QcmAnswer>;
    questionTrouAnswers: Record<QuestionTrouAnswer['id'], QuestionTrouAnswer>;
    phraseMelangeeAnswers: Record<PhraseMelangeeAnswer['id'], PhraseMelangeeAnswer>;
};

export type { anonymizedDataType };
