import { Typography, styled } from '@mui/material';
import { ReactNode } from 'react';

function QuestionInputContainer(props: {
    title: string;
    subtitle?: string;
    children: ReactNode;
    isLastItem?: boolean;
}) {
    const MainContainer = props.isLastItem ? LastContainer : Container;
    return (
        <MainContainer>
            <Typography>{props.title}</Typography>
            {!!props.subtitle && <Typography variant="h6">{props.subtitle}</Typography>}
            <InputContainer>{props.children}</InputContainer>
        </MainContainer>
    );
}

const Container = styled('div')(({ theme }) => ({
    flex: 1,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

const LastContainer = styled('div')(({ theme }) => ({
    flex: 1,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
}));

const InputContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
}));

export { QuestionInputContainer };
