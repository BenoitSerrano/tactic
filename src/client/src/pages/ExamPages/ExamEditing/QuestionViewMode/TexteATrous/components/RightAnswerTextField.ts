import { TextField, styled } from '@mui/material';

const RightAnswerTextField = styled(TextField)(({ theme }) => ({
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
}));

export { RightAnswerTextField };
