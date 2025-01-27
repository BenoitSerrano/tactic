import { gradeConverter } from '../../../lib/gradeConverter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { okGradeType, rightGradeType } from '../ExamEditingContent/QuestionPreviewing/constants';
import { Tooltip } from '@mui/material';

function GradeExplanationIcon(props: { grade: okGradeType | rightGradeType }) {
    const explanation = gradeConverter.convertGradeToExplanation(props.grade);
    return (
        <Tooltip title={explanation}>
            <HelpOutlineIcon fontSize="inherit" />
        </Tooltip>
    );
}

export { GradeExplanationIcon };
