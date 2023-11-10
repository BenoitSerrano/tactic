import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from './types';

const questionTrouTitleRegex = /(.*)\.{4}(.*)/;

function QuestionTrouAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const regexMatch = props.question.title.match(questionTrouTitleRegex);
    if (!regexMatch) {
        console.warn(`questionTrou.title "${props.question.title}" does not match regex`);
        return <div />;
    }
    const [_, beforeText, afterText] = regexMatch;
    return (
        <StyledContainer>
            <Typography>
                <IndexContainer>{props.index}</IndexContainer>. {beforeText}
            </Typography>
            <StyledTextField
                variant="outlined"
                value={props.currentAnswer}
                onChange={onChangeAnswer}
                placeholder="..."
            />
            <Typography>{afterText}</Typography>
        </StyledContainer>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
}));

const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { QuestionTrouAnswering };
