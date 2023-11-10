import { Typography, styled } from '@mui/material';
import { answerStatusType, questionType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';

const styledContainerMapping = {
    right: styled('div')(({ theme }) => ({ color: theme.palette.success.main })),
    acceptable: styled('div')(({ theme }) => ({ color: theme.palette.warning.main })),
    wrong: styled('div')(({ theme }) => ({ color: theme.palette.error.main })),
};

function QuestionChecking(props: {
    question: questionType;
    index: number;
    answerStatus: answerStatusType;
}) {
    const StyledContainer =
        props.answerStatus !== undefined
            ? styledContainerMapping[props.answerStatus]
            : NormalContainer;
    const answer = computeDisplayedAnswer(props.question);

    return (
        <StyledContainer>
            <Title>
                {props.index}. {props.question.title}
            </Title>
            {!!props.question.possibleAnswers.length && (
                <Typography>
                    Réponses proposées :
                    <ul>
                        {props.question.possibleAnswers.map((possibleAnswer) => (
                            <li key={possibleAnswer}>{possibleAnswer}</li>
                        ))}
                    </ul>
                </Typography>
            )}
            <Typography>Réponse : {answer}</Typography>
        </StyledContainer>
    );
}

const Title = styled(Typography)(({ theme }) => ({ fontWeight: 'bold' }));

const NormalContainer = styled('div')({});

export { QuestionChecking };
