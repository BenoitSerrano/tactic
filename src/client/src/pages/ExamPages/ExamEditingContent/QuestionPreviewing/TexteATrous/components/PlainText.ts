import { styled } from '@mui/material';

const PlainText = styled('span')<{ shouldDisplaySpaceBeforeCharacter: boolean }>(
    ({ theme, shouldDisplaySpaceBeforeCharacter }) => ({
        marginLeft: shouldDisplaySpaceBeforeCharacter ? '4px' : '0px',
    }),
);

export { PlainText };
