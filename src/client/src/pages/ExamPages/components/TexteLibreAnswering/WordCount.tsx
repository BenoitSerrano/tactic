import { styled, Typography } from '@mui/material';
import { wordCounter } from './lib/wordCounter';

function WordCount(props: { text: string }) {
    const wordCount = wordCounter.count(props.text);
    return (
        <Container variant="body2">
            {wordCount} mot{wordCount >= 2 && 's'}
        </Container>
    );
}

const Container = styled(Typography)(({ theme }) => ({}));
export { WordCount };
