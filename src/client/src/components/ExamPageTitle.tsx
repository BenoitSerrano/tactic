import { styled, Typography } from '@mui/material';

function ExamPageTitle(props: { examName: string }) {
    return <Title variant="h2">{props.examName}</Title>;
}

const Title = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

export { ExamPageTitle };
