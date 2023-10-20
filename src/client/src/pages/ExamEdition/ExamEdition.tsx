import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QuizIcon from '@mui/icons-material/Quiz';
import { api } from '../../lib/api';
import { Menu } from '../../components/Menu';
import { Loader } from '../../components/Loader';
import { modalStatusType } from './utils';
import { QuestionUpsertionModal } from './QuestionUpsertionModal';
import { questionWithAnswersType } from './types';
import { ExamTable } from './ExamTable';

function ExamEdition() {
    const params = useParams<{ examId: string }>();
    const examId = params.examId as string;
    const query = useQuery<{ questions: Array<questionWithAnswersType> }>(['exams', examId], () =>
        api.fetchExam(examId),
    );

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

    return (
        <>
            <Menu buttons={menuButtons} />
            <ExamTable
                questions={query.data.questions}
                examId={examId}
                openEditionModal={openEditionModal}
            />
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
