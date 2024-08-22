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
import { computePathKeyToNavigateTo } from '../../../lib/computePathKeyToNavigateTo';
import { time } from '../../../lib/time';
import { computeRemainingTime } from './lib/computeRemainingTime';

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
                    text: "Attention, les sorties de la page d'examen sont interdites. Votre professeur·e en a été averti·e",
                }),
            ),
        );
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('blur', handleFocus);
            window.removeEventListener('focus', handleFocus);
        };
    }, [displayAlert]);

    if (!query.data) {
        return (
            <NotLoggedInPage>
                <Loader />
            </NotLoggedInPage>
        );
    }
    const pathKeyToNavigateTo = computePathKeyToNavigateTo(query.data, 'take');

    if (pathKeyToNavigateTo !== 'EXAM_TAKING') {
        const pathToNavigateTo = pathHandler.getRoutePath(pathKeyToNavigateTo, {
            studentId,
            attemptId: query.data.id,
        });
        return <Navigate to={pathToNavigateTo} />;
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

    const examCaption = computeExamCaption({
        duration: query.data.exam.duration,
        startedAt: query.data.startedAt,
    });

    const lastUpdatedAt = computeReadableUpdatedAt(query.data.updatedAt);
    const remainingTime = computeRemainingTime(
        { startedAt: query.data.startedAt, duration: query.data.exam.duration },
        new Date(),
    );

    return (
        <NotLoggedInPage
            title={
                examCaption ? (
                    <TitleContainer>
                        <Typography variant="h3">{examCaption.title}</Typography>
                        <Subtitle variant="h6">{examCaption.subtitle}</Subtitle>
                    </TitleContainer>
                ) : undefined
            }
        >
            <ExamPageContainer>
                <QuestionsAnswering
                    lastUpdatedAt={lastUpdatedAt}
                    studentEmail={query.data.studentEmail}
                    title={query.data.exam.name}
                    remainingTime={remainingTime}
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

    function computeReadableUpdatedAt(updatedAt: string | undefined) {
        if (!updatedAt) {
            return undefined;
        }
        return time.formatToReadableTime(updatedAt, { hideSeconds: true });
    }

    function computeExamCaption({
        duration,
        startedAt,
    }: {
        duration: number | null;
        startedAt: string;
    }) {
        if (duration === null) {
            return undefined;
        }
        const officialEndTime = computeOfficialEndTime({
            duration,
            startedAt,
        });

        return {
            title: `Votre examen se terminera à ${officialEndTime}.`,
            subtitle: 'Passé cette heure, aucune soumission ne sera prise en compte.',
        };
    }
}

export { ExamTaking };

const TitleContainer = styled('div')({
    flexDirection: 'column',
    textAlign: 'center',
});

const Subtitle = styled(Typography)({ fontStyle: 'italic' });

const ExamPageContainer = styled('div')({
    marginTop: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});
