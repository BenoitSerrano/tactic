import { acceptableAnswerType } from '../../../../../types';
import { computeDisplayedTitle } from './lib/computeDisplayedTitle';
import { RightAnswerTextField } from './components/RightAnswerTextField';
import { PlainText } from './components/PlainText';
import { Typography, styled } from '@mui/material';

function TexteATrousEditing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const displayedTitle = computeDisplayedTitle(props.title, props.acceptableAnswers);
    return (
        <Container>
            <TitleContainer>
                {props.index}.{' '}
                {displayedTitle.map((chunk) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <PlainText>{chunk.value}</PlainText>;
                        case 'rightAnswerText':
                            return <RightAnswerTextField value={chunk.words.join(' ')} />;
                        default:
                            return undefined;
                    }
                })}
            </TitleContainer>
        </Container>
    );
}

const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const Container = styled('div')({ display: 'flex' });

export { TexteATrousEditing };
