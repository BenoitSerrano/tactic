import { LinearProgress, styled, Typography } from '@mui/material';

function ProgressBar(props: { progress: number }) {
    return (
        <ProgressWithLabelContainer>
            <Typography variant="body2">{props.progress}%</Typography>
            <ProgressContainer>
                <LinearProgress variant="determinate" value={props.progress} />
            </ProgressContainer>
        </ProgressWithLabelContainer>
    );
}

const ProgressWithLabelContainer = styled('div')({
    width: '15%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

const ProgressContainer = styled('div')(({ theme }) => ({
    width: '100%',
}));

export { ProgressBar };
