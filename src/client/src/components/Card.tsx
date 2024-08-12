import { styled } from '@mui/material';

function Card(props: { children: React.ReactNode; width?: string }) {
    return <Container width={props.width}>{props.children}</Container>;
}
const Container = styled('div')<{ width?: string }>(({ theme, width }) => ({
    padding: theme.spacing(3),
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: width,
    flex: 1,
    boxShadow: theme.shadows[1],
    border: `solid 1px ${theme.palette.divider}`,
}));

export { Card };
