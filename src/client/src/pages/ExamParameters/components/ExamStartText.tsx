import { styled, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import { replaceVariableInText } from '../../../lib/replaceVariableInText';
import { defaultStartText } from '../../ExamPages/constants';

function ExamStartText(props: {
    examStartText: string | null;
    duration: number | null;
    name: string;
}) {
    const displayedStartText = computeDisplayedStartText(props.examStartText, props.duration);
    return (
        <Container>
            <Title variant="h4">{props.name}</Title>
            <MainText variant="h5">
                <Markdown>{displayedStartText}</Markdown>
            </MainText>
        </Container>
    );

    function computeDisplayedStartText(examStartText: string | null, duration: number | null) {
        const displayedStartText = examStartText !== null ? examStartText : defaultStartText;
        return replaceVariableInText(displayedStartText, { duration });
    }
}

const MainText = styled(Typography)({ textAlign: 'justify' });
const Container = styled('div')({});
const Title = styled(Typography)({ textAlign: 'center' });
export { ExamStartText };
