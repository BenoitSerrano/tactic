import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { aggregateAcceptableAnswersByGrade } from '../lib/aggregateAcceptableAnswersByGrade';

function QuestionReponsePreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);
    const areThereSeveralRightAnswers = aggregatedAcceptableAnswers['A'].length > 1;
    const areThereAcceptableAnswers = aggregatedAcceptableAnswers['A'].length > 0;
    return (
        <Container>
            <TitleContainer>
                {props.index}. {props.title}
            </TitleContainer>

            <AcceptableAnswersContainer>
                {!areThereAcceptableAnswers
                    ? renderNoRightAnswer()
                    : areThereSeveralRightAnswers
                    ? renderSeveralRightAnswers(aggregatedAcceptableAnswers['A'])
                    : renderRightAnswer(aggregatedAcceptableAnswers['A'][0])}
            </AcceptableAnswersContainer>
        </Container>
    );

    function renderNoRightAnswer() {
        return <Typography>Pas de réponse correcte.</Typography>;
    }

    function renderRightAnswer(rightAnswer: string) {
        return (
            <Typography>
                Réponse correcte : <RightAnswerText>{rightAnswer}</RightAnswerText>
            </Typography>
        );
    }

    function renderSeveralRightAnswers(rightAnswers: string[]) {
        return (
            <>
                <Typography>Réponses correctes :</Typography>
                <ul>
                    {rightAnswers.map((rightAnswer) => (
                        <ListItem key={`right-answer-${rightAnswer}`}>
                            <Typography>{rightAnswer}</Typography>
                        </ListItem>
                    ))}
                </ul>
            </>
        );
    }
}

const Container = styled('div')({});
const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    fontWeight: 'bold',
}));
const RightAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.success.main }));
const AcceptableAnswersContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const ListItem = styled('li')(({ theme }) => ({ color: theme.palette.success.main }));

export { QuestionReponsePreviewing };
