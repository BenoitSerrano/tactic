import { Typography, styled } from '@mui/material';
import { ReactNode } from 'react';

function QuestionInputContainer(props: { title: string; subtitle?: string; children: ReactNode }) {
    return (
        <Container>
            <Typography>{props.title}</Typography>
            {!!props.subtitle && <Typography variant="h6">{props.subtitle}</Typography>}
            <InputContainer>{props.children}</InputContainer>
        </Container>
    );
}

const Container = styled('div')({ flex: 1 });
const InputContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

export { QuestionInputContainer };
