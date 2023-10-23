import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExercisesTable } from './ExercisesTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { examApiType, exerciseType, modalStatusType } from './types';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';
import { Menu } from '../../components/Menu';
import { Typography, styled } from '@mui/material';

function ExamExercises() {
    const params = useParams<{ examId: string }>();

    const [currentExerciseModalStatus, setCurrentExerciseModalStatus] = useState<
        modalStatusType | undefined
    >();
    const examId = params.examId as string;
    const query = useQuery<examApiType>(['exams', examId], () => api.fetchExam(examId));
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    const menuButtons = [
        {
            title: 'Ajouter un exercice',
            onClick: () => setCurrentExerciseModalStatus({ kind: 'creating' }),
            IconComponent: PlaylistAddIcon,
        },
    ];
    return (
        <>
            <TitleContainer>
                <Typography variant="h3">{query.data.name}</Typography>
            </TitleContainer>
            <Menu buttons={menuButtons} />
            <ExercisesTable
                examId={examId}
                exercises={query.data.exercises}
                openEditionModal={openEditionModal}
            />
            {!!currentExerciseModalStatus && (
                <ExerciseUpsertionModal
                    examId={examId}
                    modalStatus={currentExerciseModalStatus}
                    close={() => setCurrentExerciseModalStatus(undefined)}
                />
            )}
        </>
    );

    function openEditionModal(exercise: exerciseType) {
        setCurrentExerciseModalStatus({ kind: 'editing', exercise });
    }
}

const TitleContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

export { ExamExercises };
