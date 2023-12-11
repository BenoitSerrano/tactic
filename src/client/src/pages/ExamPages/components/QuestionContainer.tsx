import { styled } from '@mui/material';

function QuestionContainer(props: {
    children: React.ReactNode;

    isLastItem: boolean;
}) {
    return <Container>{props.children}</Container>;
}

const Container = styled('div')(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
}));

export { QuestionContainer };
