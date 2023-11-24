import { Typography, styled } from '@mui/material';
import { attemptsCountByAttemptStatusApiType } from './types';
import { HEADER_HEIGHT } from '../../../constants';

function AttemptsCount(props: {
    attemptsCountByCorrectedStatus: attemptsCountByAttemptStatusApiType;
}) {
    return (
        <Container>
            <Typography variant="h4">
                Copies corrigées : {props.attemptsCountByCorrectedStatus.corrected} /{' '}
                {props.attemptsCountByCorrectedStatus.corrected +
                    props.attemptsCountByCorrectedStatus.notCorrected}
            </Typography>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    position: 'fixed',
    right: theme.spacing(2),
    top: HEADER_HEIGHT,
    marginTop: theme.spacing(3),
}));

export { AttemptsCount };
