import { styled } from '@mui/material';

const BLANK_TEXT_FIELD_WIDTH = 100;

const RightAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.success.main }));
const OkAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.warning.main }));

const textComponentMapping = {
    A: RightAnswerText,
    B: OkAnswerText,
    C: OkAnswerText,
    D: OkAnswerText,
};

export { BLANK_TEXT_FIELD_WIDTH, textComponentMapping };
