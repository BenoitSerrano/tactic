import { Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { localStorage } from '../../lib/localStorage';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';

const HEIGHT = 60;
const BORDER_COLOR = '#ddf';

function Header() {
    const navigate = useNavigate();
    const jwtToken = localStorage.jwtTokenHandler.get();
    return (
        <Container>
            <Link to="/">
                <Typography variant="h3">Tactic</Typography>
            </Link>
            <MenuContainer>
                <LinkContainer>
                    <Link to={'#product'}>
                        <Typography variant="h6">Produit</Typography>
                    </Link>
                </LinkContainer>
                <LinkContainer>
                    <Link to={'#pricing'}>
                        <Typography variant="h6">Tarifs</Typography>
                    </Link>
                </LinkContainer>
                <LinkContainer>
                    <Link to={'#contact'}>
                        <Typography variant="h6">Contact</Typography>
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
        navigate('/sign-up');
    }

    function onSignInClick() {
        navigate('/sign-in');
    }

    function onGoToDashboardClick() {
        navigate('/teacher');
    }
}

const Container = styled('div')({
    paddingLeft: 32,
    paddingRight: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEIGHT,
    backgroundColor: 'white',
    borderBottom: `${BORDER_COLOR} 1px solid`,
});

const MenuContainer = styled('div')({ display: 'flex', justifyContent: 'space-between' });
const LinkContainer = styled('div')({ paddingRight: 48, paddingLeft: 48 });
const ButtonsContainer = styled('div')({ display: 'flex' });
const ButtonContainer = styled('div')({ marginRight: 8, marginLeft: 8 });

export { Header };
