import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { gradeConverter } from '../../../../lib/gradeConverter';
import { okGradeType, okGrades, rightGradeType, textComponentMapping } from './constants';
import {
    aggregateAcceptableAnswersByGrade,
    aggregatedAcceptableAnswerType,
} from '../lib/aggregateAcceptableAnswersByGrade';
import { GradeExplanationIcon } from './components/GradeExplanationIcon';
import { Caption } from '../components/Caption';

function AcceptableAnswersPreviewing(props: { acceptableAnswers: acceptableAnswerType[][] }) {
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);
    const areThereAcceptableAnswers = aggregatedAcceptableAnswers['A'].length > 0;
    const areThereOkAnswers = okGrades.some(
        (okGrade) => aggregatedAcceptableAnswers[okGrade].length > 0,
    );
    return (
        <Container>
            {!areThereAcceptableAnswers
                ? renderNoRightAnswer()
                : renderRightAnswers(aggregatedAcceptableAnswers['A'])}

            {areThereOkAnswers &&
                okGrades.map((okGrade) =>
                    renderOkAnswers(okGrade, aggregatedAcceptableAnswers[okGrade]),
                )}
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
        const adjective = gradeConverter.convertGradeToAdjective(okGrade);

        if (okAnswers.length === 0) {
            return (
                <Typography>
                    <Caption>Réponse {adjective}</Caption> <GradeExplanationIcon grade={okGrade} />{' '}
                    : -
                </Typography>
            );
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
        const adjective = gradeConverter.convertGradeToAdjective(grade);
        const TextComponent = textComponentMapping[grade];

        return (
            <Typography>
                <Caption>Réponse {adjective}</Caption> <GradeExplanationIcon grade={grade} /> :{' '}
                <TextComponent>{acceptableAnswer.answer}</TextComponent>
            </Typography>
        );
    }

    function renderSeveralAcceptableAnswers(
        grade: rightGradeType | okGradeType,
        acceptableAnswers: aggregatedAcceptableAnswerType[],
    ) {
        const adjective = gradeConverter.convertGradeToAdjective(grade, { isPlural: true });
        const TextComponent = textComponentMapping[grade];
        return (
            <>
                <Typography>
                    <Caption>Réponses {adjective}</Caption> <GradeExplanationIcon grade={grade} /> :
                </Typography>
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

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { AcceptableAnswersPreviewing };
