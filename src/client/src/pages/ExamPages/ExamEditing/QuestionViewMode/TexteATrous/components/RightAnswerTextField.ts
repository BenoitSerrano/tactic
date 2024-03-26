import { TextField, styled } from '@mui/material';
import { BLANK_TEXT_FIELD_WIDTH } from '../../../../constants';

const RightAnswerTextField = styled(TextField)(({ theme }) => ({
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
    width: BLANK_TEXT_FIELD_WIDTH,
}));

export { RightAnswerTextField };
