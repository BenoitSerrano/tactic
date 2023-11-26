import { Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import Markdown from 'react-markdown';
import { computeExerciseResult } from '../lib/computeExerciseResult';

function ExerciseContainer<
    questionT extends { points: number; mark?: number | undefined },
    exerciseT extends { id: number; name: string; instruction: string; questions: questionT[] },
>(props: { exercise: exerciseT; children: ReactNode; isLastItem: boolean; hideMark?: boolean }) {
    const exerciseResult = computeExerciseResult(props.exercise, { hideMark: props.hideMark });
    const Container = props.isLastItem ? LastContainer : DefaultContainer;
    return (
        <Container key={'exercise-' + props.exercise.id}>
            <ExerciseHeaderContainer>
                <TitleContainer>
                    <Typography variant="h3">{props.exercise.name}</Typography>
                    <Typography variant="h4">{exerciseResult}</Typography>
                </TitleContainer>
                <Typography>
                    <Markdown className="exercise-markdown">{props.exercise.instruction}</Markdown>
                </Typography>
            </ExerciseHeaderContainer>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const ExerciseHeaderContainer = styled('div')(({ theme }) => ({
    flex: 1,
}));
