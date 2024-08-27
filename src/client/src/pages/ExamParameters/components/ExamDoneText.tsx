import { styled, Typography } from '@mui/material';
import Markdown from 'react-markdown';
import { defaultEndText } from '../../ExamPages/constants';

function ExamDoneText(props: { examEndText: string | null }) {
    const endText = computeDisplayedEndText(props.examEndText);

    return (
        <Text variant="h5">
            <Markdown>{endText}</Markdown>
        </Text>
    );

    function computeDisplayedEndText(examEndText: string | null) {
        const displayedEndText = examEndText !== null ? examEndText : defaultEndText;
        return displayedEndText;
    }
}

const Text = styled(Typography)({ textAlign: 'center' });

export { ExamDoneText };
