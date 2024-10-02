import { styled } from '@mui/material';
import { StudentPage } from '../../components/StudentPage';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { examApiType } from '../ExamList/types';
import { ExamDoneText } from '../ExamParameters/components/ExamDoneText';

function ExamDone() {
    const params = useParams();

    const examId = params.examId as string;
    const query = useQuery<examApiType>({
        queryKey: ['exams', examId],
        queryFn: () => api.fetchExam(examId),
    });

    if (!query.data) {
        return <Loader />;
    }

    return (
        <StudentPage>
            <MainContainer>
                <TextContainer>
                    <ExamDoneText examEndText={query.data.endText} />
                </TextContainer>
            </MainContainer>
        </StudentPage>
    );
}

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
});

const TextContainer = styled('div')({
    width: '50%',
});

export { ExamDone };
