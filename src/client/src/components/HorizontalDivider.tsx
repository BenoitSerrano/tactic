import { styled } from '@mui/material';

const HorizontalDivider = styled('div')(({ theme }) => ({
    height: 1,
    backgroundColor: `${theme.palette.common.black}`,
    width: '100%',
}));

export { HorizontalDivider };
