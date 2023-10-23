import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QuizIcon from '@mui/icons-material/Quiz';
import { api } from '../../lib/api';
import { Menu } from '../../components/Menu';
import { Loader } from '../../components/Loader';
import { modalStatusType } from './utils';
import { QuestionUpsertionModal } from './QuestionUpsertionModal';
import { exerciseApiType, questionWithAnswersType } from './types';
import { ExamTable } from './ExamTable';

function ExamQuestionsEdition() {
    const params = useParams<{ examId: string; exerciseId: string }>();
    const examId = params.examId as string;
    const exerciseId = Number(params.exerciseId);
    const query = useQuery<exerciseApiType>(['exams', examId, 'exercises', exerciseId], () =>
        api.fetchExercise({ examId, exerciseId }),
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
                    exerciseId={exerciseId}
                    examId={examId}
                    modalStatus={currentQuestionModalStatus}
                    close={() => setCurrentQuestionModalStatus(undefined)}
                />
            )}
        </>
    );
}

export { ExamQuestionsEdition };
