import { Typography, styled, Tooltip } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { ReactNode } from 'react';
import Markdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
    computeExerciseIndication,
    exerciseIndicationType,
} from '../lib/computeExerciseIndication';
import { computeHash, exerciseIndexesType } from '../lib/useExerciseIndex';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';

const EXERCISE_ACCORDION_SUMMARY_HEIGHT = 52;

function ExerciseContainer<
    questionT extends { points: number; mark?: number | undefined },
    exerciseT extends { id: number; name: string; instruction: string; questions: questionT[] },
>(props: {
    currentExerciseIndex: number;
    exerciseIndexes: exerciseIndexesType;
    exercise: exerciseT;
    children: ReactNode;
    warningToDisplay?: string;
    indication?: exerciseIndicationType;
}) {
    const navigate = useNavigate();
    const { result, progress } = computeExerciseIndication(props.exercise, props.indication);
    return (
        <Container>
            <HeaderContainer>
                <TitleContainer>
                    <ExerciseHeaderContainer>
                        {!!props.warningToDisplay && (
                            <WarningIconContainer title={props.warningToDisplay}>
                                <PriorityHighIcon fontSize="small" color="error" />
                            </WarningIconContainer>
                        )}
                        <ExerciseTitle variant="h3">
                            Exercice {props.currentExerciseIndex}
                        </ExerciseTitle>
                        {progress !== undefined && <ProgressBar progress={progress} />}
                    </ExerciseHeaderContainer>

                    <TitleRightPartContainer>
                        <Typography variant="h4">( {result})</Typography>
                    </TitleRightPartContainer>
                </TitleContainer>
            </HeaderContainer>
            <Typography variant="h4">{props.exercise.name}</Typography>

            <ContentContainer>
                <Typography>
                    <Markdown className="exercise-markdown">{props.exercise.instruction}</Markdown>
                </Typography>
                {props.children}
            </ContentContainer>
            <FooterContainer>
                <Button
                    variant="outlined"
                    disabled={props.exerciseIndexes.previous === undefined}
                    onClick={onPreviousExerciseClick}
                    startIcon={<ArrowBackIcon />}
                >
                    Exercice précédent
                </Button>
                <Button
                    variant="outlined"
                    disabled={props.exerciseIndexes.next === undefined}
                    onClick={onNextExerciseClick}
                    endIcon={<ArrowForwardIcon />}
                >
                    Exercice suivant
                </Button>
            </FooterContainer>
        </Container>
    );

    function onPreviousExerciseClick() {
        if (props.exerciseIndexes.previous === undefined) {
            return;
        }
        const hash = computeHash(props.exerciseIndexes.previous);
        navigate(hash);
    }

    function onNextExerciseClick() {
        if (props.exerciseIndexes.next === undefined) {
            return;
        }
        const hash = computeHash(props.exerciseIndexes.next);
        navigate(hash);
    }
}

export { ExerciseContainer, EXERCISE_ACCORDION_SUMMARY_HEIGHT };

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    boxShadow: 'none' as const,
    elevation: 0,
}));

const ContentContainer = styled('div')({ padding: 0 });

const TitleContainer = styled('div')({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
});

const WarningIconContainer = styled(Tooltip)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: `-${theme.spacing(3)}`,
    height: '100%',
}));

const HeaderContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const ExerciseTitle = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(2),
    textDecoration: 'underline',
}));

const ExerciseHeaderContainer = styled('div')({ display: 'flex', alignItems: 'center', flex: 1 });
const TitleRightPartContainer = styled('div')(({ theme }) => ({ display: 'flex' }));
const FooterContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(2),
    justifyContent: 'space-between',
}));
