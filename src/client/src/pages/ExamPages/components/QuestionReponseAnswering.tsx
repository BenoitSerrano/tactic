import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';

function QuestionReponseAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <StyledContainer>
            <Title>
                {props.index}. {props.question.title}
            </Title>
            <StyledTextField
                fullWidth
                variant="outlined"
                value={props.currentAnswer}
                onChange={onChangeAnswer}
                placeholder="..."
            />
        </StyledContainer>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

const Title = styled(Typography)({ fontWeight: 'bold' });
export { QuestionReponseAnswering };
