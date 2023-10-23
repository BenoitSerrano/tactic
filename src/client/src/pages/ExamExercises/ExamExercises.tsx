import { useParams } from 'react-router-dom';
import { ExercisesTable } from './ExercisesTable';
import { useQuery } from '@tanstack/react-query';
import { examApiType, exerciseType, modalStatusType } from './types';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { ExerciseUpsertionModal } from './ExerciseUpsertionModal';
import { useState } from 'react';

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
    return (
        <>
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

export { ExamExercises };
