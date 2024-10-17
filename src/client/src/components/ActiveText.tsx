import { styled, Typography } from '@mui/material';

const ActiveText = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    color: theme.palette.primary.dark,
    textShadow: `0px 0px 1px ${theme.palette.primary.dark}`,
}));

export { ActiveText };
