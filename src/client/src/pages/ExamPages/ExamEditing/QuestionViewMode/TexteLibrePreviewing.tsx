import { Typography, styled } from '@mui/material';

function TexteLibrePreviewing(props: { index: number; title: string }) {
    return (
        <Container>
            {props.index}. {props.title}
        </Container>
    );
}

const Container = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    fontWeight: 'bold',
}));

export { TexteLibrePreviewing };
