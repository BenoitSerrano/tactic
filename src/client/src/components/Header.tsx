import { styled } from '@mui/material';
import { Logo } from './Logo';
import { Link } from './Link';

const HEIGHT = 60;

function Header(props: { logoLink?: string; buttons: Array<JSX.Element>; title?: JSX.Element }) {
    return (
        <Container>
            {props.logoLink ? (
                <Link to={props.logoLink}>
                    <Logo />
                </Link>
            ) : (
                <Logo />
            )}
            <TitleContainer>{props.title}</TitleContainer>

            <ButtonsContainer>{props.buttons}</ButtonsContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEIGHT,
    backgroundColor: 'white',
    borderBottom: `${theme.palette.divider} 1px solid`,
}));
const TitleContainer = styled('div')({ display: 'flex', backgroundColor: 'red' });

const ButtonsContainer = styled('div')({ display: 'flex' });

export { Header };
