import { styled, Typography } from '@mui/material';

function Section(props: { children: React.ReactNode; title: string }) {
    return (
        <Container>
            <Title variant="h4">{props.title}</Title>
            <div>{props.children}</div>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
}));

const Title = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(2) }));

export { Section };