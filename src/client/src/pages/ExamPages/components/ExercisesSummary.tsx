import { styled, Typography } from '@mui/material';
import { TextLink } from '../../../components/TextLink';
import { computeHash } from '../lib/useExerciseIndex';
import { BREADCRUMBS_HEIGHT, HEADER_HEIGHT } from '../../../constants';
import { ActiveText } from '../../../components/ActiveText';
import { ProgressBar } from './ProgressBar';

function ExercisesSummary(props: { currentExerciseIndex: number; progresses: number[] }) {
    return (
        <Container>
            <ExerciseList>
                {props.progresses.map((progress, exerciseIndex) => {
                    const hash = computeHash(exerciseIndex);
                    const smallLabel = `${exerciseIndex + 1}`;
                    const label = `Exercice ${smallLabel}`;
                    const progressValue = Math.floor(progress * 100);
                    const formattedProgress = `${progressValue} %`;
                    const TextComponent =
                        exerciseIndex === props.currentExerciseIndex ? (
                            <ActiveText label={label} smallLabel={smallLabel} />
                        ) : (
                            <TextLink
                                onClick={scrollToTop}
                                label={label}
                                smallLabel={smallLabel}
                                to={hash}
                            />
                        );
                    return (
                        <ExerciseSummaryContainer>
                            {TextComponent}
                            <ProgressBarContainer>
                                <ProgressBar hideValue progress={progressValue} />
                            </ProgressBarContainer>
                            <PercentageText variant="body2"> - {formattedProgress}</PercentageText>
                        </ExerciseSummaryContainer>
                    );
                })}
            </ExerciseList>
        </Container>
    );

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export { ExercisesSummary };

const Container = styled('div')(({ theme }) => ({
    background: 'white',
    position: 'fixed',
    zIndex: 100,
    left: 0,
    top: HEADER_HEIGHT + BREADCRUMBS_HEIGHT,
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
        margin: theme.spacing(1),
    },
    borderRadius: '2px',
}));

const PercentageText = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        display: 'none',
    },
}));
const ProgressBarContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        display: 'none',
    },
    width: '100%',
}));
const ExerciseSummaryContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('lg')]: {
        flexDirection: 'row',
    },
    [theme.breakpoints.down('lg')]: {
        flexDirection: 'column',
    },
    ':not(:last-child)': {
        marginBottom: theme.spacing(1),
    },
}));
const ExerciseList = styled('div')(({ theme }) => ({ display: 'flex', flexDirection: 'column' }));
