import { Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { aggregateAcceptableAnswersByGrade } from '../lib/aggregateAcceptableAnswersByGrade';
import { convertGradeToAdjective } from '../../lib/convertGradeToAdjective';

type rightGradeType = 'A';
const okGrades = ['B', 'C', 'D'] as const;
type okGradeType = (typeof okGrades)[number];

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
    function renderRightAnswers(rightAnswers: string[]) {
        if (rightAnswers.length > 1) {
            return renderSeveralAcceptableAnswers('A', rightAnswers);
        } else {
            return renderAcceptableAnswer('A', rightAnswers[0]);
        }
    }

    function renderOkAnswers(okGrade: okGradeType, okAnswers: string[]) {
        const adjective = convertGradeToAdjective(okGrade);

        if (okAnswers.length === 0) {
            return <Typography>Réponse {adjective} : -</Typography>;
        }
        if (okAnswers.length === 1) {
            return renderAcceptableAnswer(okGrade, okAnswers[0]);
        }
        return renderSeveralAcceptableAnswers(okGrade, okAnswers);
    }

    function renderAcceptableAnswer(grade: rightGradeType | okGradeType, acceptableAnswer: string) {
        const adjective = convertGradeToAdjective(grade);
        const TextComponent = textComponentMapping[grade];

        return (
            <Typography>
                Réponse {adjective} : <TextComponent>{acceptableAnswer}</TextComponent>
            </Typography>
        );
    }

    function renderSeveralAcceptableAnswers(
        grade: rightGradeType | okGradeType,
        acceptableAnswers: string[],
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
                                <TextComponent>{acceptableAnswer}</TextComponent>
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
const RightAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.success.main }));
const OkAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.warning.main }));
const AcceptableAnswersContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const textComponentMapping = {
    A: RightAnswerText,
    B: OkAnswerText,
    C: OkAnswerText,
    D: OkAnswerText,
};

export { QuestionReponsePreviewing };
