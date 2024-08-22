import { styled } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

function TextLink(props: {
    children: React.ReactNode | string;
    to: string;
    opensNewTab?: boolean;
}) {
    const target = props.opensNewTab ? '_blank' : undefined;

    return (
        <StyledLink target={target} to={props.to}>
            {props.children}
        </StyledLink>
    );
}

export { TextLink };

const StyledLink = styled(ReactRouterLink)(({ theme }) => ({
    color: theme.palette.common.black,
    display: 'block',
    textDecoration: 'none',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover': {
        color: theme.palette.primary.dark,
    },
}));
