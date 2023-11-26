import { Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import Markdown from 'react-markdown';

function ExerciseContainer<
    exerciseT extends { id: number; name: string; instruction: string },
>(props: { exercise: exerciseT; children: ReactNode; isLastItem: boolean }) {
    const Container = props.isLastItem ? LastContainer : DefaultContainer;
    return (
        <Container key={'exercise-' + props.exercise.id}>
            <TitleContainer>
                <Typography variant="h3">{props.exercise.name}</Typography>
                <Typography>
                    <Markdown className="exercise-markdown">{props.exercise.instruction}</Markdown>
                </Typography>
            </TitleContainer>
            {props.children}
        </Container>
    );
}

export { ExerciseContainer };

const DefaultContainer = styled('div')(({ theme }) => ({
    userSelect: 'none',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.common.black}`,
}));

const LastContainer = styled('div')(({ theme }) => ({
    userSelect: 'none',
    marginTop: theme.spacing(2),
}));

const TitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));
