import { styled } from '@mui/material';

function QuestionContainer(props: { children: React.ReactNode }) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    display: 'flex',
}));

export { QuestionContainer };
