import { styled } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

const LINK_COLOR = '#44445f';

function Link(props: { children: JSX.Element | string; to: string }) {
    return <StyledLink to={props.to}>{props.children}</StyledLink>;
}

const StyledLink = styled(ReactRouterLink)({
    color: LINK_COLOR,
    textDecorationLine: 'none',
});
export { Link };
