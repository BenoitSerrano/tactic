import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Typography, styled } from '@mui/material';
import { NotLoggedInPage } from '../../../components/NotLoggedInPage';
import { Loader } from '../../../components/Loader';
import { api } from '../../../lib/api';
import { QuestionsAnswering } from './QuestionsAnswering';
import { attemptWithoutAnswersType } from './types';
import { computeShouldNavigateToExamDone } from './lib/computeShouldNavigateToExamDone';
import { computeOfficialEndTime } from './lib/computeOfficialEndTime';
import { pathHandler } from '../../../lib/pathHandler';
import { useEffect } from 'react';
import { cheatingHandler } from '../../../lib/cheatingHandler';
import { eventHandler } from '../../../lib/eventHandler';
import { useAlert } from '../../../lib/alert';

function ExamTaking() {
    const params = useParams();
    const attemptId = params.attemptId as string;
    const studentId = params.studentId as string;
    const navigate = useNavigate();
    const query = useQuery<attemptWithoutAnswersType>({
        queryKey: ['attempts-without-answers', attemptId],
        queryFn: () => api.fetchAttemptWithoutAnswers(attemptId),
    });
    const { displayAlert } = useAlert();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const pathname = (event.currentTarget as Window).location.pathname;
            const attemptId = pathHandler.extractCurrentAttemptId(pathname);
            if (!!attemptId) {
                event.returnValue = null;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        const handleBlur = eventHandler.buildHandleWindowEvent(
            cheatingHandler.buildOnFocusChangeCallback('blur', () =>
                displayAlert({
                    variant: 'warning',
                    text: "Vous êtes sorti de la page. Veuillez revenir sur la page de l'examen.",
                }),
            ),
        );

        window.addEventListener('blur', handleBlur);

        const handleFocus = eventHandler.buildHandleWindowEvent(
            cheatingHandler.buildOnFocusChangeCallback('focus', () =>
                displayAlert({
                    variant: 'warning',
                    text: "Vous êtes revenu sur la page. Sachez que votre professeur est informé des sorties d'examen.",
                }),
            ),
        );
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('blur', handleFocus);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    if (!query.data) {
        return (
            <NotLoggedInPage>
                <Loader />
            </NotLoggedInPage>
        );
    }

    const examDonePath = pathHandler.getRoutePath('EXAM_DONE', { studentId });

    const shouldNavigateToExamDone = computeShouldNavigateToExamDone(new Date(), {
        duration: query.data.exam.duration,
        endedAt: query.data.endedAt,
        extraTime: query.data.exam.extraTime,
        startedAt: query.data.startedAt,
    });

    if (shouldNavigateToExamDone) {
        return <Navigate to={examDonePath} />;
    }

    const officialEndTime = computeOfficialEndTime({
        duration: query.data.exam.duration,
        startedAt: query.data.startedAt,
    });

    const title = `Votre test se terminera à ${officialEndTime}.`;

    return (
        <NotLoggedInPage
            title={
                <TitleContainer>
                    <Typography variant="h3">{title}</Typography>
                    <Typography variant="h6">
                        Enregistrez vos réponses régulièrement. Passé cette heure, aucune soumission
                        ne sera prise en compte.
                    </Typography>
                </TitleContainer>
            }
        >
            <ExamPageContainer>
                <QuestionsAnswering
                    studentEmail={query.data.studentEmail}
                    title={query.data.exam.name}
                    exercises={query.data.exam.exercises}
                    attemptId={attemptId}
                    onExamDone={onExamDone}
                />
            </ExamPageContainer>
        </NotLoggedInPage>
    );

    function onExamDone() {
        navigate(examDonePath);
    }
}

export { ExamTaking };

const TitleContainer = styled('div')({
    flexDirection: 'column',
    textAlign: 'center',
});

const ExamPageContainer = styled('div')({
    marginTop: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
