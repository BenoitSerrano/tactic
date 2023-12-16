import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';

function QuestionTrouAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <StyledContainer>
            <Typography>
                <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
            </Typography>
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

const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { QuestionTrouAnswering };
