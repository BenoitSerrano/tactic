import { styled } from '@mui/material';
import { Logo } from './Logo';

const HEIGHT = 60;

function StudentHeader(props: { title?: string }) {
    return (
        <Container>
            <Logo />
            <TitleContainer>{props.title}</TitleContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEIGHT,
    backgroundColor: 'white',
    width: '100%',
    borderBottom: `${theme.palette.divider} 1px solid`,
}));

const TitleContainer = styled('div')({ display: 'flex', justifyContent: 'space-between' });

export { StudentHeader };
