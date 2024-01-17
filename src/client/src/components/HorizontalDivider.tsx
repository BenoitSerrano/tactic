import { styled } from '@mui/material';

const HorizontalDivider = styled('div')(({ theme }) => ({
    height: 1,
    backgroundColor: `${theme.palette.common.black}`,
    width: '100%',
}));

const LightHorizontalDivider = styled('div')(({ theme }) => ({
    height: 1,
    backgroundColor: `${theme.palette.grey[400]}`,
    width: '100%',
}));

const VeryLightHorizontalDivider = styled('div')(({ theme }) => ({
    height: 1,
    backgroundColor: `${theme.palette.grey[200]}`,
    width: '100%',
}));

export { HorizontalDivider, LightHorizontalDivider, VeryLightHorizontalDivider };
