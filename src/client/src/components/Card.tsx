import { styled } from '@mui/material';
import { CSSProperties } from 'react';

type sizeType = 'small' | 'medium' | 'large';

const sizeMapping: Record<sizeType, string> = {
    small: '30%',
    medium: '40%',
    large: '80%',
};

function Card(props: {
    children: React.ReactNode;
    style?: CSSProperties;
    width?: string;
    size?: sizeType;
}) {
    const minWidth = props.size ? sizeMapping[props.size] : undefined;
    return (
        <Container style={props.style} minWidth={minWidth}>
            {props.children}
        </Container>
    );
}
const Container = styled('div')<{ minWidth: string | undefined }>(({ theme, style, minWidth }) => ({
    padding: theme.spacing(3),
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth,
    boxShadow: theme.shadows[1],
    border: `solid 1px ${theme.palette.divider}`,

    ...style,
}));

export { Card };
