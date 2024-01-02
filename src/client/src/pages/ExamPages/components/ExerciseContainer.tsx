import {
    Accordion,
    AccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    LinearProgress,
    Typography,
    styled,
    Tooltip,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
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
    isExpanded: boolean;
    warningToDisplay?: string;
    onChangeExpanded: (_: any, isExpanded: boolean) => void;
    indication?: exerciseIndicationType;
}) {
    const { result, progress } = computeExerciseIndication(props.exercise, props.indication);
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
                        {!!props.warningToDisplay && (
                            <WarningIconContainer title={props.warningToDisplay}>
                                <PriorityHighIcon fontSize="small" color="error" />
                            </WarningIconContainer>
                        )}
                        <ExercisePointsContainer>
                            <Typography variant="h4">( {result})</Typography>
                        </ExercisePointsContainer>
                        <Typography variant="h3">{props.exercise.name}</Typography>
                    </ExerciseHeaderContainer>
                    {progress !== undefined && (
                        <ProgressWithLabelContainer>
                            <Typography variant="body2">{progress}%</Typography>
                            <ProgressContainer>
                                <LinearProgress variant="determinate" value={progress} />
                            </ProgressContainer>
                        </ProgressWithLabelContainer>
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

const Container = styled(Accordion)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    boxShadow: 'none' as const,
    elevation: 0,
}));

const ProgressWithLabelContainer = styled('div')({
    width: '15%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

const ProgressContainer = styled('div')(({ theme }) => ({
    width: '100%',
}));

const AccordionContent = styled(AccordionDetails)({ padding: 0 });

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

const AccordionSummary = styled(MuiAccordionSummary)({ padding: 0 });

const ExerciseHeaderContainer = styled('div')({ display: 'flex', alignItems: 'center' });
const ExercisePointsContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(1) }));
