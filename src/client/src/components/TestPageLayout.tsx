import { Typography, styled } from '@mui/material';

function TestPageLayout(props: { title: string; bottomOffset?: number; children: JSX.Element[] }) {
    return (
        <Container sx={{ mb: props.bottomOffset ? props.bottomOffset + 'px' : 0 }}>
            <TitleContainer>
                <Typography variant="h1">{props.title}</Typography>
            </TitleContainer>

            {props.children}
        </Container>
    );
}

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: theme.spacing(6),
}));

const Container = styled('div')(({ theme }) => ({
    width: '60%',
    borderRadius: 2,
    border: `solid ${theme.palette.common.black} 1px`,
    boxShadow: theme.shadows[4],
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
}));

export { TestPageLayout };
