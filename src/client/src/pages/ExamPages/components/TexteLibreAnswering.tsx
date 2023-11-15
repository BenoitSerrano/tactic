import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';

function TexteLibreAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <Container>
            <TitleContainer>
                <Typography>
                    <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
                </Typography>
            </TitleContainer>
            <StyledTextField
                placeholder="..."
                value={props.currentAnswer}
                onChange={onChangeAnswer}
            />
        </Container>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const TitleContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));
const StyledTextField = styled(TextField)({ flex: 1 });
const IndexContainer = styled('span')({ fontWeight: 'bold' });
const Container = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
});
export { TexteLibreAnswering };
