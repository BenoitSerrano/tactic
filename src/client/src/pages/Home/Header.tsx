import { Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { localStorage } from '../../lib/localStorage';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { pathHandler } from '../../lib/pathHandler';
import { HEADER_HEIGHT } from '../../constants';

function Header() {
    const navigate = useNavigate();
    const jwtToken = localStorage.jwtTokenHandler.get();
    return (
        <Container>
            <Link to="/">
                <Logo />
            </Link>
            <MenuContainer>
                <LinkContainer>
                    <Link to={'#product'}>
                        <Typography variant="h5">Produit</Typography>
                    </Link>
                </LinkContainer>
                <LinkContainer>
                    <Link to={'#pricing'}>
                        <Typography variant="h5">Tarifs</Typography>
                    </Link>
                </LinkContainer>
            </MenuContainer>
            {!!jwtToken ? (
                <ButtonContainer>
                    <Button onClick={onGoToDashboardClick}>Tableau de bord</Button>
                </ButtonContainer>
            ) : (
                <ButtonsContainer>
                    <ButtonContainer>
                        <Button variant="outlined" onClick={onSignInClick}>
                            Se connecter
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button variant="contained" onClick={onSignUpClick}>
                            Créer un compte
                        </Button>
                    </ButtonContainer>
                </ButtonsContainer>
            )}
        </Container>
    );

    function onSignUpClick() {
        navigate(pathHandler.getRoutePath('SIGN_UP'));
    }

    function onSignInClick() {
        navigate(pathHandler.getRoutePath('SIGN_IN'));
    }

    function onGoToDashboardClick() {
        navigate(pathHandler.getRoutePath('TEACHER_HOME'));
    }
}

const Container = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    borderBottom: `${theme.palette.divider} 1px solid`,
}));

const MenuContainer = styled('div')({ display: 'flex', justifyContent: 'space-between' });
const LinkContainer = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),
}));
const ButtonsContainer = styled('div')({ display: 'flex' });
const ButtonContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
}));

export { Header };
