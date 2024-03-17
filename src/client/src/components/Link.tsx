import { styled } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

function Link(props: { children: React.ReactNode | string; to: string; opensNewTab?: boolean }) {
    const target = props.opensNewTab ? '_blank' : undefined;
    return (
        <StyledLink target={target} to={props.to}>
            {props.children}
        </StyledLink>
    );
}

const StyledLink = styled(ReactRouterLink)(({ theme }) => ({
    color: theme.palette.common.black,
}));
export { Link };
