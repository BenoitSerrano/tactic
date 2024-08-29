import { styled, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import { replaceVariableInText } from '../../../lib/replaceVariableInText';

function ExamStartText(props: { examStartText: string; duration: number | null; name: string }) {
    const displayedStartText = replaceVariableInText(props.examStartText, {
        duration: props.duration,
    });
    return (
        <Container>
            <Title variant="h4">{props.name}</Title>
            <MainText variant="h5">
                <Markdown>{displayedStartText}</Markdown>
            </MainText>
        </Container>
    );
}

const MainText = styled(Typography)({ textAlign: 'justify' });
const Container = styled('div')({});
const Title = styled(Typography)({ textAlign: 'center' });
export { ExamStartText };
