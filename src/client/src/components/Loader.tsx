import { CircularProgress, styled } from '@mui/material';

type sizeType = 'small' | 'medium' | 'large';

const sizeMapping: Record<sizeType, number> = {
    small: 20,
    medium: 25,
    large: 40,
};

function Loader(props: { size?: sizeType }) {
    const size = props.size || 'large';
    return (
        <Container>
            <CircularProgress size={sizeMapping[size]} />
        </Container>
    );
}
const Container = styled('div')({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Loader };
