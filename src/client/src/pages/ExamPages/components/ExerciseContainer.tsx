import { Accordion, AccordionDetails, AccordionSummary, Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Markdown from 'react-markdown';
import {
    computeExerciseIndication,
    exerciseIndicationType,
} from '../lib/computeExerciseIndication';

function ExerciseContainer<
    questionT extends { points: number; mark?: number | undefined },
    exerciseT extends { id: number; name: string; instruction: string; questions: questionT[] },
>(props: {
    exercise: exerciseT;
    children: ReactNode;
    isLastItem: boolean;
    isExpanded: boolean;
    onChangeExpanded: (_: any, isExpanded: boolean) => void;
    indication?: exerciseIndicationType;
}) {
    const { result, progress } = computeExerciseIndication(props.exercise, props.indication);
    const Container = props.isLastItem ? LastContainer : DefaultContainer;
    return (
        <Container
            onChange={props.onChangeExpanded}
            expanded={props.isExpanded}
            disableGutters
            key={'exercise-' + props.exercise.id}
            sx={{
                '&:before': {
                    display: 'none',
                },
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
                <TitleContainer>
                    <ExerciseHeaderContainer>
                        <ExercisePointsContainer>
                            <Typography variant="h4">( {result})</Typography>
                        </ExercisePointsContainer>
                        <Typography variant="h3">{props.exercise.name}</Typography>
                    </ExerciseHeaderContainer>
                    {progress !== undefined && (
                        <Typography variant="h4">{progress}% complétés</Typography>
                    )}
                </TitleContainer>
            </AccordionSummary>
            <AccordionContent>
                <Typography>
                    <Markdown className="exercise-markdown">{props.exercise.instruction}</Markdown>
                </Typography>
                {props.children}
            </AccordionContent>
        </Container>
    );
}

export { ExerciseContainer };

const mainContainerProperties = {
    userSelect: 'none' as const,
    boxShadow: 'none' as const,
    elevation: 0,
};

const DefaultContainer = styled(Accordion)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.common.black}`,
    ...mainContainerProperties,
}));

const AccordionContent = styled(AccordionDetails)({ padding: 0 });

const LastContainer = styled(Accordion)(({ theme }) => ({ ...mainContainerProperties }));

const TitleContainer = styled('div')({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
});

const ExerciseHeaderContainer = styled('div')({ display: 'flex', alignItems: 'center' });
const ExercisePointsContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(1) }));
