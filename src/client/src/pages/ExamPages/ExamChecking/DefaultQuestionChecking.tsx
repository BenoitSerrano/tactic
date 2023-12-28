import { Typography, styled } from '@mui/material';
import { displayedAnswerType } from '../lib/computeDisplayedAnswer';

const styledContainerMapping = {
    right: styled('span')(({ theme }) => ({
        color: theme.palette.success.main,
    })),
    acceptable: styled('span')(({ theme }) => ({
        color: theme.palette.warning.main,
    })),
    wrong: styled('span')(({ theme }) => ({ color: theme.palette.error.main })),
};

function DefaultQuestionChecking(props: {
    index: number;
    displayedAnswer: displayedAnswerType;
    canUpdateAnswers: boolean;
}) {
    return (
        <Container>
            <Title>
                {props.index}.{' '}
                {props.displayedAnswer.title.map((chunk) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <span>{chunk.value}</span>;
                        case 'coloredText':
                            const StyledComponent = styledContainerMapping[chunk.status || 'wrong'];
                            return (
                                <>
                                    <StyledComponent> {chunk.value} </StyledComponent>
                                </>
                            );
                        default:
                            return <span />;
                    }
                })}
            </Title>
            {!!props.displayedAnswer.answer && (
                <Typography>
                    Réponse :{' '}
                    {props.displayedAnswer.answer.map((chunk) => {
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
        </Container>
    );
}

const Title = styled(Typography)({ fontWeight: 'bold' });

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { DefaultQuestionChecking };
