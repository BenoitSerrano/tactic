import { gradeConverter } from '../../../../lib/gradeConverter';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { okGradeType, rightGradeType } from './constants';
import { Tooltip } from '@mui/material';

function GradeExplanationIcon(props: { grade: okGradeType | rightGradeType }) {
    const explanation = gradeConverter.convertGradeToExplanation(props.grade);
    return (
        <Tooltip title={explanation}>
            <KeyboardIcon fontSize="small" />
        </Tooltip>
    );
}

export { GradeExplanationIcon };
