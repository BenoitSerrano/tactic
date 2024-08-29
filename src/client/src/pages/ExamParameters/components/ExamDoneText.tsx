import { styled, Typography } from '@mui/material';
import Markdown from 'react-markdown';

function ExamDoneText(props: { examEndText: string }) {
    return (
        <Text variant="h5">
            <Markdown>{props.examEndText}</Markdown>
        </Text>
    );
}

const Text = styled(Typography)({ textAlign: 'center' });

export { ExamDoneText };
