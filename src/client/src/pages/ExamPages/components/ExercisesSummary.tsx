import { styled, Typography } from '@mui/material';
import { exerciseSummaryType } from '../lib/computeExercisesSummary';
import { TextLink } from '../../../components/TextLink';
import { computeHash } from '../lib/useExerciseIndex';
import { HEADER_HEIGHT } from '../../../constants';
import { ActiveText } from '../../../components/ActiveText';

function ExercisesSummary(props: {
    currentExerciseIndex: number;
    exercisesSummary: exerciseSummaryType[];
}) {
    return (
        <Container>
            <ExerciseList>
                {props.exercisesSummary.map((exerciseSummary, exerciseIndex) => {
                    const hash = computeHash(exerciseIndex);
                    const label = `Exercice ${exerciseIndex + 1}`;
                    const formattedProgress = `${Math.floor(exerciseSummary.progress * 100)} %`;
                    const TextComponent =
                        exerciseIndex === props.currentExerciseIndex ? (
                            <ActiveText>{label}</ActiveText>
                        ) : (
                            <TextLink label={label} to={hash} />
                        );
                    return (
                        <ExerciseSummaryContainer>
                            {TextComponent}
                             - 
                            <Typography variant="body2">{formattedProgress}</Typography>
                        </ExerciseSummaryContainer>
                    );
                })}
            </ExerciseList>
        </Container>
    );
}

export { ExercisesSummary };

const Container = styled('div')(({ theme }) => ({
    background: theme.palette.common.white,
    position: 'fixed',
    zIndex: 100,
    left: 0,
    top: HEADER_HEIGHT,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: '2px',
}));
const ExerciseSummaryContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));
const ExerciseList = styled('div')(({ theme }) => ({ display: 'flex', flexDirection: 'column' }));
