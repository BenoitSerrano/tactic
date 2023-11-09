import { Typography, styled } from '@mui/material';

function TestPageLayout(props: {
    title: string;
    studentEmail: string;
    result?: string;
    children: JSX.Element[] | JSX.Element;
    buttons: JSX.Element[];
}) {
    return (
        <Container>
            <TitleContainer>
                <Typography variant="h1">{props.title}</Typography>
            </TitleContainer>
            <StudentInfoContainer>
                <StudentEmail>Adresse e-mail : {props.studentEmail}</StudentEmail>
                {!!props.result && <Typography variant="caption">{props.result}</Typography>}
            </StudentInfoContainer>
            {props.children}
            {!!props.buttons.length && <ButtonContainer>{props.buttons}</ButtonContainer>}
        </Container>
    );
}

const BUTTON_CONTAINER_HEIGHT = 50;

const ButtonContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: BUTTON_CONTAINER_HEIGHT,
    backgroundColor: 'white',
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
});

const StudentInfoContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const StudentEmail = styled(Typography)(({ theme }) => ({
    fontStyle: 'italic',
}));

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
}));

const Container = styled('div')(({ theme }) => ({
    width: '60%',
    marginBottom: BUTTON_CONTAINER_HEIGHT,
    borderRadius: 2,
    border: `solid ${theme.palette.common.black} 1px`,
    boxShadow: theme.shadows[4],
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.common.white,
}));

export { TestPageLayout };
