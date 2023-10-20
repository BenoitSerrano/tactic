import { CircularProgress, styled } from '@mui/material';

function Loader() {
    return (
        <Container>
            <CircularProgress />
        </Container>
    );
}
const Container = styled('div')({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Loader };
