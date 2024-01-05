import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import {
    aggregateAcceptableAnswersByGrade,
    aggregatedAcceptableAnswerType,
} from '../lib/aggregateAcceptableAnswersByGrade';
import { convertGradeToAdjective } from '../../lib/convertGradeToAdjective';
import { okGradeType, okGrades, rightGradeType, textComponentMapping } from './constants';

function QuestionReponsePreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);
    const areThereAcceptableAnswers = aggregatedAcceptableAnswers['A'].length > 0;
    const areThereOkAnswers = okGrades.some(
        (okGrade) => aggregatedAcceptableAnswers[okGrade].length > 0,
    );
    return (
        <Container>
            <TitleContainer>
                {props.index}. {props.title}
            </TitleContainer>

            <AcceptableAnswersContainer>
                {!areThereAcceptableAnswers
                    ? renderNoRightAnswer()
                    : renderRightAnswers(aggregatedAcceptableAnswers['A'])}

                {areThereOkAnswers &&
                    okGrades.map((okGrade) =>
                        renderOkAnswers(okGrade, aggregatedAcceptableAnswers[okGrade]),
                    )}
            </AcceptableAnswersContainer>
        </Container>
    );

    function renderNoRightAnswer() {
        return <Typography>Pas de réponse correcte.</Typography>;
    }
    function renderRightAnswers(rightAnswers: aggregatedAcceptableAnswerType[]) {
        if (rightAnswers.length > 1) {
            return renderSeveralAcceptableAnswers('A', rightAnswers);
        } else {
            return renderAcceptableAnswer('A', rightAnswers[0]);
        }
    }

    function renderOkAnswers(okGrade: okGradeType, okAnswers: aggregatedAcceptableAnswerType[]) {
        const adjective = convertGradeToAdjective(okGrade);

        if (okAnswers.length === 0) {
            return <Typography>Réponse {adjective} : -</Typography>;
        }
        if (okAnswers.length === 1) {
            return renderAcceptableAnswer(okGrade, okAnswers[0]);
        }
        return renderSeveralAcceptableAnswers(okGrade, okAnswers);
    }

    function renderAcceptableAnswer(
        grade: rightGradeType | okGradeType,
        acceptableAnswer: aggregatedAcceptableAnswerType,
    ) {
        const adjective = convertGradeToAdjective(grade);
        const TextComponent = textComponentMapping[grade];

        return (
            <Typography>
                Réponse {adjective} : <TextComponent>{acceptableAnswer.answer}</TextComponent>
            </Typography>
        );
    }

    function renderSeveralAcceptableAnswers(
        grade: rightGradeType | okGradeType,
        acceptableAnswers: aggregatedAcceptableAnswerType[],
    ) {
        const adjective = convertGradeToAdjective(grade, { isPlural: true });
        const TextComponent = textComponentMapping[grade];
        return (
            <>
                <Typography>Réponses {adjective} :</Typography>
                <ul>
                    {acceptableAnswers.map((acceptableAnswer) => (
                        <li key={`acceptable-answer-${grade}-${acceptableAnswer}`}>
                            <Typography>
                                <TextComponent>{acceptableAnswer.answer}</TextComponent>
                            </Typography>
                        </li>
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
const AcceptableAnswersContainer = styled('div')({ display: 'flex', flexDirection: 'column' });

export { QuestionReponsePreviewing };
