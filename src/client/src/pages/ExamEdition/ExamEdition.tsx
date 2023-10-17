import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Menu } from '../../components/Menu';
import { Loader } from '../../components/Loader';
import { modalStatusType } from './utils';
import { QuestionUpsertionModal } from './QuestionUpsertionModal';
import { questionWithAnswersType } from './types';
import { ExamsTable } from './ExamsTable';
import { questionKindIconComponentMapping } from './constants';

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
            title: 'Ajouter une nouvelle QCM',
            onClick: () => setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'qcm' }),
            IconComponent: questionKindIconComponentMapping['qcm'],
        },
        {
            title: 'Ajouter une nouvelle question à trou',
            onClick: () =>
                setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'questionTrou' }),
            IconComponent: questionKindIconComponentMapping['questionTrou'],
        },
        {
            title: 'Ajouter une nouvelle phrase mélangée',
            onClick: () =>
                setCurrentQuestionModalStatus({ kind: 'creating', questionKind: 'phraseMelangee' }),
            IconComponent: questionKindIconComponentMapping['phraseMelangee'],
        },
    ];
    function openEditionModal(question: questionWithAnswersType) {
        setCurrentQuestionModalStatus({ kind: 'editing', question });
    }

    return (
        <>
            <Menu buttons={menuButtons} />
            <ExamsTable
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
