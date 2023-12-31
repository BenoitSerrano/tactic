import { styled } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

function Link(props: { children: JSX.Element | string; to: string }) {
    return <StyledLink to={props.to}>{props.children}</StyledLink>;
}

const StyledLink = styled(ReactRouterLink)(({ theme }) => ({
    color: theme.palette.common.black,
    textDecorationLine: 'none',
}));
export { Link };
