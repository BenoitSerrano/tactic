import { styled } from '@mui/material';

function Card(props: { children: React.ReactNode; width?: string }) {
    return <Container width={props.width}>{props.children}</Container>;
}
const Container = styled('div')<{ width?: string }>(({ theme, width }) => ({
    padding: theme.spacing(3),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: width,
    boxShadow: theme.shadows[1],
    border: `solid 1px ${theme.palette.divider}`,
}));

export { Card };
