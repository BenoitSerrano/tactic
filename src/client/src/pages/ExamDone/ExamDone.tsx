import { styled } from '@mui/material';
import { StudentPage } from '../../components/StudentPage';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../../components/Loader';
import { examApiType } from '../Classe/types';
import { ExamDoneText } from '../ExamParameters/components/ExamDoneText';
import { examsApi } from '../../lib/api/examsApi';

function ExamDone() {
    const params = useParams();

    const examId = params.examId as string;
    const query = useQuery<examApiType>({
        queryKey: ['exams', examId],
        queryFn: () => examsApi.getExam(examId),
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
