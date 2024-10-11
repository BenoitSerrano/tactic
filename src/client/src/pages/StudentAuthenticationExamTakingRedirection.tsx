import { useNavigate, useParams } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';
import { attemptActionEncoder } from '../lib/attemptActionEncoder';
import { useEffect } from 'react';
import { NotLoggedInPage } from '../components/NotLoggedInPage';

function StudentAuthenticationExamTakingRedirection() {
    const params = useParams();
    const navigate = useNavigate();
    const examId = params.examId as string;
    useEffect(() => {
        const encodedAction = attemptActionEncoder.encode('take');
        navigate(pathHandler.getRoutePath('STUDENT_AUTHENTICATION', { examId, encodedAction }));
    }, [examId, navigate]);

    return (
        <NotLoggedInPage>
            <div />
        </NotLoggedInPage>
    );
}
export { StudentAuthenticationExamTakingRedirection };
