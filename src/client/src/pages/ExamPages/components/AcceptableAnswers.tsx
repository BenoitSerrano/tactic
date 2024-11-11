import { Typography } from '@mui/material';
import { okGradeType, rightGradeType } from '../ExamEditingContent/QuestionPreviewing/constants';
import { gradeConverter } from '../../../lib/gradeConverter';
import { textComponentMapping } from '../constants';
import { Caption } from './Caption';
import { GradeExplanationIcon } from './GradeExplanationIcon';

function AcceptableAnswers(props: { values: string[]; grade: rightGradeType | okGradeType }) {
    if (props.values.length > 1) {
        return renderSeveralAcceptableAnswers(props.grade, props.values);
    } else if (props.values.length === 1) {
        return renderAcceptableAnswer(props.grade, props.values[0]);
    }

    return <span />;

    function renderAcceptableAnswer(grade: rightGradeType | okGradeType, value: string) {
        const adjective = gradeConverter.convertGradeToAdjective(grade);
        const TextComponent = textComponentMapping[grade];

        return (
            <Typography>
                <Caption>Réponse {adjective}</Caption> <GradeExplanationIcon grade={grade} /> :{' '}
                <TextComponent>{value}</TextComponent>
            </Typography>
        );
    }

    function renderSeveralAcceptableAnswers(grade: rightGradeType | okGradeType, values: string[]) {
        const adjective = gradeConverter.convertGradeToAdjective(grade, { isPlural: true });
        const TextComponent = textComponentMapping[grade];
        return (
            <>
                <Typography>
                    <Caption>Réponses {adjective}</Caption> <GradeExplanationIcon grade={grade} /> :
                </Typography>
                <ul>
                    {values.map((value) => (
                        <li key={`acceptable-answer-${grade}-${value}`}>
                            <Typography>
                                <TextComponent>{value}</TextComponent>
                            </Typography>
                        </li>
                    ))}
                </ul>
            </>
        );
    }
}

export { AcceptableAnswers };
