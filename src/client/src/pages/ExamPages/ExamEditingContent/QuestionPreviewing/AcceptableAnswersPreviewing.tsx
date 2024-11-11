import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { gradeConverter } from '../../../../lib/gradeConverter';
import { okGradeType, okGrades } from './constants';
import {
    aggregateAcceptableAnswersByGrade,
    aggregatedAcceptableAnswerType,
} from '../lib/aggregateAcceptableAnswersByGrade';
import { GradeExplanationIcon } from '../../components/GradeExplanationIcon';
import { Caption } from '../../components/Caption';
import { AcceptableAnswers } from '../../components/AcceptableAnswers';

function AcceptableAnswersPreviewing(props: { acceptableAnswers: acceptableAnswerType[][] }) {
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);
    const areThereAcceptableAnswers = aggregatedAcceptableAnswers['A'].length > 0;
    const areThereOkAnswers = okGrades.some(
        (okGrade) => aggregatedAcceptableAnswers[okGrade].length > 0,
    );
    return (
        <Container>
            {!areThereAcceptableAnswers ? (
                renderNoRightAnswer()
            ) : (
                <AcceptableAnswers
                    grade="A"
                    values={aggregatedAcceptableAnswers['A'].map(({ answer }) => answer)}
                />
            )}

            {areThereOkAnswers &&
                okGrades.map((okGrade) =>
                    renderOkAnswers(okGrade, aggregatedAcceptableAnswers[okGrade]),
                )}
        </Container>
    );

    function renderNoRightAnswer() {
        return <Typography>Pas de réponse correcte.</Typography>;
    }

    function renderOkAnswers(okGrade: okGradeType, okAnswers: aggregatedAcceptableAnswerType[]) {
        const adjective = gradeConverter.convertGradeToAdjective(okGrade);

        if (okAnswers.length === 0) {
            return (
                <Typography>
                    <Caption>Réponse {adjective}</Caption> <GradeExplanationIcon grade={okGrade} />{' '}
                    : -
                </Typography>
            );
        }
        return <AcceptableAnswers grade={okGrade} values={okAnswers.map(({ answer }) => answer)} />;
    }
}

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { AcceptableAnswersPreviewing };
