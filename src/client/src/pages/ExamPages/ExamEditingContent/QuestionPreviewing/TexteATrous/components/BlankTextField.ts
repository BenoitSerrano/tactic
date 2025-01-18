import { TextField, styled } from '@mui/material';
import { BLANK_TEXT_FIELD_WIDTH } from '../../../../constants';

const BlankTextField = styled(TextField)(({ theme }) => ({
    color: theme.palette.success.main,
    marginLeft: '4px',
    width: BLANK_TEXT_FIELD_WIDTH,
}));

export { BlankTextField };
