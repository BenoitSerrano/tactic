import { Typography, styled } from '@mui/material';
import { questionKindType } from '../../types';

const styledContainerMapping = {
    right: styled('div')(({ theme }) => ({ color: theme.palette.success.main })),
    acceptable: styled('div')(({ theme }) => ({ color: theme.palette.warning.main })),
    wrong: styled('div')(({ theme }) => ({ color: theme.palette.error.main })),
};

function QuestionChecking(props: {
    question: {
        id: number;
        title: string;
        kind: questionKindType;
        possibleAnswers: string[];
        answer: string | undefined;
        mark: number;
        points: number;
    };
    index: number;
}) {
    const status = computeStatus(props.question.mark, props.question.points);
    const StyledContainer = styledContainerMapping[status];
    let answer = '';
    if (props.question.answer !== undefined && props.question.answer !== '') {
        if (props.question.kind === 'qcm' && props.question.possibleAnswers !== null) {
            answer = props.question.possibleAnswers[Number(props.question.answer)];
        } else {
            answer = props.question.answer;
        }
    }

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

    function computeStatus(mark: number, points: number) {
        if (!mark) {
            return 'wrong';
        }
        if (mark === points) {
            return 'right';
        }
        return 'acceptable';
    }
}

const Title = styled(Typography)(({ theme }) => ({ fontWeight: 'bold' }));

export { QuestionChecking };
