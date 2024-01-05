import { styled } from '@mui/material';

const rightGrades = ['A'] as const;
type rightGradeType = (typeof rightGrades)[number];
const okGrades = ['B', 'C', 'D'] as const;
type okGradeType = (typeof okGrades)[number];

const RightAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.success.main }));
const OkAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.warning.main }));

const textComponentMapping = {
    A: RightAnswerText,
    B: OkAnswerText,
    C: OkAnswerText,
    D: OkAnswerText,
};

export { textComponentMapping, okGrades, rightGrades };
export type { rightGradeType, okGradeType };
