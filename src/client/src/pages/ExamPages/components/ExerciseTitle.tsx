import { Typography, styled } from '@mui/material';
import Markdown from 'react-markdown';

function ExerciseTitle<exerciseT extends { name: string; instruction: string }>(props: {
    exercise: exerciseT;
}) {
    console.log(props.exercise);
    return (
        <ExerciseTitleContainer>
            <Typography variant="h3">{props.exercise.name}</Typography>
            <Typography>
                <Markdown>{props.exercise.instruction}</Markdown>
            </Typography>
        </ExerciseTitleContainer>
    );
}

export { ExerciseTitle };

const ExerciseTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));
