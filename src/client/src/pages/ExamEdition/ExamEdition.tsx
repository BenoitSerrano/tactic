import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QuizIcon from '@mui/icons-material/Quiz';
import { api } from '../../lib/api';
import { Menu } from '../../components/Menu';
import { Loader } from '../../components/Loader';
import { modalStatusType } from './utils';
import { QuestionUpsertionModal } from './QuestionUpsertionModal';
import { examApiType, questionWithAnswersType } from './types';
import { ExamTable } from './ExamTable';
import { questionType } from '../../types';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const query = useQuery<examApiType>(['exams', examId], () => api.fetchExam(examId));

    const [currentQuestionModalStatus, setCurrentQuestionModalStatus] = useState<
        modalStatusType | undefined
    >();

    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    const menuButtons = [
        {
            title: 'Ajouter une question',
            onClick: () => setCurrentQuestionModalStatus({ kind: 'creating' }),
            IconComponent: QuizIcon,
        },
    ];
    function openEditionModal(question: questionWithAnswersType) {
        setCurrentQuestionModalStatus({ kind: 'editing', question });
    }

    const questions: Array<questionWithAnswersType> = [];
    for (const exercise of query.data.exercises) {
        questions.push(...exercise.questions);
    }

    return (
        <>
            <Menu buttons={menuButtons} />
            <ExamTable questions={questions} examId={examId} openEditionModal={openEditionModal} />
            {!!currentQuestionModalStatus && (
                <QuestionUpsertionModal
                    examId={examId}
                    modalStatus={currentQuestionModalStatus}
                    close={() => setCurrentQuestionModalStatus(undefined)}
                />
            )}
        </>
    );
}

export { ExamEdition };
