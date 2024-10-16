import { styled } from '@mui/material';
import { exerciseSummaryType } from '../lib/computeExercisesSummary';
import { TextLink } from '../../../components/TextLink';
import { computeHash } from '../lib/useExerciseIndex';
import { ProgressBar } from './ProgressBar';

function ExercisesSummary(props: {
    currentExerciseIndex: number;
    exercisesSummary: exerciseSummaryType[];
}) {
    console.log(props.exercisesSummary);
    return (
        <Container>
            <ExerciseList>
                {props.exercisesSummary.map((exerciseSummary, exerciseIndex) => {
                    const hash = computeHash(exerciseIndex);
                    const label = `Exercice ${exerciseIndex + 1}`;
                    return (
                        <ExerciseSummaryContainer>
                            <TextLink label={label} to={hash} />
                            <ProgressBar progress={exerciseSummary.progress} />
                        </ExerciseSummaryContainer>
                    );
                })}
            </ExerciseList>
        </Container>
    );
}

export { ExercisesSummary };

const Container = styled('div')(({ theme }) => ({
    background: 'red',
    position: 'fixed',
    zIndex: 100,
    left: 0,
}));
const ExerciseSummaryContainer = styled('div')(({ theme }) => ({ display: 'flex' }));
const ExerciseList = styled('div')(({ theme }) => ({ display: 'flex', flexDirection: 'column' }));
