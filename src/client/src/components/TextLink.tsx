import { styled, Typography } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

function TextLink(props: {
    to: string;
    label: string;
    smallLabel?: string;
    opensNewTab?: boolean;
    onClick?: () => void;
}) {
    const target = props.opensNewTab ? '_blank' : undefined;
    const isThereSmallLabel = props.smallLabel !== undefined;

    return (
        <StyledLink target={target} to={props.to} onClick={props.onClick}>
            {isThereSmallLabel && <SmallLabel>{props.smallLabel}</SmallLabel>}
            <Label isThereSmallLabel={isThereSmallLabel}>{props.label}</Label>
        </StyledLink>
    );
}

export { TextLink };

const Label = styled(Typography)<{ isThereSmallLabel: boolean }>(
    ({ theme, isThereSmallLabel }) => ({
        padding: theme.spacing(1),

        [theme.breakpoints.down('lg')]: {
            display: isThereSmallLabel ? 'none' : 'inherit',
        },
    }),
);
const SmallLabel = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    paddingBottom: 0,
    [theme.breakpoints.up('lg')]: { display: 'none' },
}));

const StyledLink = styled(ReactRouterLink)(({ theme }) => ({
    color: theme.palette.common.black,
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));
