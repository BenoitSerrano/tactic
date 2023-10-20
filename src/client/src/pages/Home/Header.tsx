import React from 'react';
import { Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { localStorage } from '../../lib/localStorage';
import { Link } from '../../components/Link';

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
            <div>
                {!!jwtToken ? (
                    <Button onClick={onGoToDashboardClick}>Tableau de bord</Button>
                ) : (
                    <>
                        <Button onClick={onSignUpClick}>Créer un compte</Button>
                        <Button onClick={onSignInClick}>Se connecter</Button>
                    </>
                )}
            </div>
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
    paddingLeft: 16,
    paddingright: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: HEIGHT,
    backgroundColor: 'white',
    borderBottom: `${BORDER_COLOR} 1px solid`,
});

const MenuContainer = styled('div')({ display: 'flex', justifyContent: 'space-between' });
const LinkContainer = styled('div')({ paddingRight: 48, paddingLeft: 48 });

export { Header };
