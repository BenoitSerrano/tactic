import { Typography } from '@mui/material';
import { EditableDuration } from './ExamList/EditableDuration';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';

type examApiType = { id: string; name: string; duration: number };

function ExamParameters() {
    const params = useParams();
    const examQuery = useQuery<examApiType>({
        queryKey: [`exams`],
        queryFn: () => api.fetchExam(params.examId as string),
    });
    if (!examQuery.data) {
        if (examQuery.isLoading) {
            return <Loader />;
        } else {
            return <div />;
        }
    }
    return (
        <div>
            <Typography variant="h3">Paramètres</Typography>
            <Typography variant="h4">Durée</Typography>
            <EditableDuration exam={examQuery.data} />
        </div>
    );
}

export { ExamParameters };
