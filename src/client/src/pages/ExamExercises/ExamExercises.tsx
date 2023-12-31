import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExercisesTable } from './ExercisesTable';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { examApiType, exerciseType } from './types';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { Menu } from '../../components/Menu';
import { Typography, styled } from '@mui/material';

function ExamExercises() {
    const params = useParams<{ examId: string }>();

    const examId = params.examId as string;
    const query = useQuery<examApiType>({
        queryKey: ['exams', examId],
        queryFn: () => api.fetchExam(examId),
    });
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <>
            <TitleContainer>
                <Typography variant="h3">{query.data.name}</Typography>
            </TitleContainer>
            <ExercisesTable
                examId={examId}
                exercises={query.data.exercises}
                openEditionModal={() => {}}
            />
        </>
    );
}

const TitleContainer = styled('div')(({ theme }) => ({
    textAlign: 'center',
}));

export { ExamExercises };
