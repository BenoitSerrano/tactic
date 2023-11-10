import { Typography, styled } from '@mui/material';
import { answerStatusType, questionType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';

const styledContainerMapping = {
    right: styled('span')(({ theme }) => ({ color: theme.palette.success.main })),
    acceptable: styled('span')(({ theme }) => ({ color: theme.palette.warning.main })),
    wrong: styled('span')(({ theme }) => ({ color: theme.palette.error.main })),
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
    const displayedAnswer = computeDisplayedAnswer(props.question, props.answerStatus);

    return (
        <StyledContainer>
            <Title>
                {props.index}.{' '}
                {displayedAnswer.title.map((chunk) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <span>{chunk.value}</span>;
                        case 'coloredText':
                            const StyledComponent = styledContainerMapping[chunk.status || 'wrong'];
                            return <StyledComponent> {chunk.value} </StyledComponent>;
                        default:
                            return <span />;
                    }
                })}
            </Title>
            {!!displayedAnswer.answer && (
                <Typography>
                    Réponse :{' '}
                    {displayedAnswer.answer.map((chunk) => {
                        switch (chunk.kind) {
                            case 'text':
                                return <span>{chunk.value}</span>;
                            case 'coloredText':
                                const StyledComponent =
                                    styledContainerMapping[chunk.status || 'wrong'];
                                return <StyledComponent> {chunk.value} </StyledComponent>;
                            default:
                                return <span />;
                        }
                    })}
                </Typography>
            )}
        </StyledContainer>
    );
}

const Title = styled(Typography)(({ theme }) => ({ fontWeight: 'bold' }));

const NormalContainer = styled('div')({});

export { QuestionChecking };
