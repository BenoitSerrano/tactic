import { LinearProgress, styled, Typography } from '@mui/material';

function ProgressBar(props: { progress: number; hideValue?: boolean; width?: string }) {
    const barColor = computeBarColor(props.progress);
    return (
        <ProgressWithLabelContainer width={props.width}>
            {!props.hideValue && <Typography variant="body2">{props.progress} %</Typography>}
            <ProgressContainer>
                <LinearProgress color={barColor} variant="determinate" value={props.progress} />
            </ProgressContainer>
        </ProgressWithLabelContainer>
    );
}

function computeBarColor(progress: number): 'success' | 'warning' {
    if (progress === 100) {
        return 'success';
    }
    return 'warning';
}

const ProgressWithLabelContainer = styled('div')<{ width?: string }>(({ width }) => ({
    width: width || '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
}));

const ProgressContainer = styled('div')(({ theme }) => ({
    width: '100%',
}));

export { ProgressBar };
