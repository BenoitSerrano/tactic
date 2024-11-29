import { LinearProgress, Typography, styled } from '@mui/material';
import { HEADER_HEIGHT } from '../../../constants';
import { attemptsCountByAttemptStatusApiType } from '../../../lib/api/attemptsApi';

function AttemptsCount(props: {
    attemptsCountByCorrectedStatus: attemptsCountByAttemptStatusApiType;
}) {
    const totalAttemptsCount =
        props.attemptsCountByCorrectedStatus.corrected +
        props.attemptsCountByCorrectedStatus.notCorrected;
    const correctedAttemptsCount = props.attemptsCountByCorrectedStatus.corrected;
    const progress =
        totalAttemptsCount > 0 ? (correctedAttemptsCount / totalAttemptsCount) * 100 : 0;
    return (
        <Container>
            <AttemptsCountText variant="h4">
                Copies corrigées : {correctedAttemptsCount} / {totalAttemptsCount}
            </AttemptsCountText>
            <LinearProgress variant="determinate" value={progress} />
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    position: 'fixed',
    borderColor: theme.palette.divider,
    borderWidth: '1px',
    padding: theme.spacing(1),
    borderStyle: 'solid',
    borderRadius: '10px',
    backgroundColor: theme.palette.common.white,
    right: theme.spacing(2),
    top: HEADER_HEIGHT,
    marginTop: theme.spacing(2),
}));

const AttemptsCountText = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(1) }));

export { AttemptsCount };
