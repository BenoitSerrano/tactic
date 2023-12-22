import { Typography, styled } from '@mui/material';
// import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { answerStatusType, questionWithAnswersType } from '../types';
import { computeDisplayedAnswer } from '../lib/computeDisplayedAnswer';
// import { useState } from 'react';

const styledContainerMapping = {
    right: styled('span')(({ theme }) => ({
        color: theme.palette.success.main,
        cursor: 'pointer',
    })),
    acceptable: styled('span')(({ theme }) => ({
        color: theme.palette.warning.main,
        cursor: 'pointer',
    })),
    wrong: styled('span')(({ theme }) => ({ color: theme.palette.error.main, cursor: 'pointer' })),
};

function QuestionChecking(props: {
    question: questionWithAnswersType;
    index: number;
    answerStatus: answerStatusType;
}) {
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const displayedAnswer = computeDisplayedAnswer(props.question, props.answerStatus);
    // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // const open = Boolean(anchorEl);
    return (
        <Container>
            {/* <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <IconButton size="small" color="error" onClick={() => {}}>
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => {}}>
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => {}}>
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => {}}>
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
            </Menu> */}
            <Title>
                {props.index}.{' '}
                {displayedAnswer.title.map((chunk) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <span>{chunk.value}</span>;
                        case 'coloredText':
                            const StyledComponent = styledContainerMapping[chunk.status || 'wrong'];
                            return (
                                <>
                                    {/* <StyledComponent onClick={handleClick}> */}
                                    <StyledComponent> {chunk.value} </StyledComponent>
                                </>
                            );
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
        </Container>
    );
}

const Title = styled(Typography)(({ theme }) => ({ fontWeight: 'bold' }));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { QuestionChecking };
