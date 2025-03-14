import { styled, Typography } from '@mui/material';

function ActiveText(props: { label: string; smallLabel?: string }) {
    const isThereSmallLabel = props.smallLabel !== undefined;
    return (
        <>
            {isThereSmallLabel && <SmallLabel>{props.smallLabel}</SmallLabel>}
            <Label isThereSmallLabel={isThereSmallLabel}>{props.label}</Label>
        </>
    );
}

const Label = styled(Typography)<{ isThereSmallLabel: boolean }>(
    ({ theme, isThereSmallLabel }) => ({
        padding: theme.spacing(1),
        color: theme.palette.primary.dark,
        textShadow: `0px 0px 1px ${theme.palette.primary.dark}`,
        [theme.breakpoints.down('lg')]: {
            display: isThereSmallLabel ? 'none' : 'inherit',
        },
    }),
);

const SmallLabel = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: { display: 'none' },
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(1),
        paddingBottom: 0,
        color: theme.palette.primary.dark,
        textShadow: `0px 0px 1px ${theme.palette.primary.dark}`,
    },
}));

export { ActiveText };
