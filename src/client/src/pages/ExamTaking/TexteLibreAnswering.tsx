import { TextField, Typography, styled } from '@mui/material';
import { questionType } from './types';

function TexteLibreAnswering(props: {
    question: questionType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    return (
        <>
            <TitleContainer>
                <Typography>
                    <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
                </Typography>
            </TitleContainer>
            <TextField multiline fullWidth value={props.currentAnswer} onChange={onChangeAnswer} />
        </>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        props.setCurrentAnswer(event.target.value);
    }
}

const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));

const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { TexteLibreAnswering };
