import { Typography, styled } from '@mui/material';

function ExerciseTitle<exerciseT extends { name: string; instruction: string }>(props: {
    exercise: exerciseT;
}) {
    return (
        <ExerciseTitleContainer>
            <Typography variant="h3">{props.exercise.name}</Typography>
            <Typography variant="h4">{props.exercise.instruction}</Typography>
        </ExerciseTitleContainer>
    );
}

export { ExerciseTitle };

const ExerciseTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));
