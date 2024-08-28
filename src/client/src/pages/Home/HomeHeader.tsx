import { Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { localStorage } from '../../lib/localStorage';
import { Link } from '../../components/Link';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { pathHandler } from '../../lib/pathHandler';
import { Header } from '../../components/Header';
import { IconButton } from '../../components/IconButton';
import { BurgerMenu } from './BurgerMenu';
import { NAV_LINKS } from './constants';
import { BurgerDrawer } from './BurgerDrawer';
import { useState } from 'react';
import { TextLink } from '../../components/TextLink';

type headerButtonType = {
    title: string;
    IconComponent: React.ElementType;
    onClick: () => void;
    importance: 'primary' | 'secondary';
};

const importanceToVariantMapping = {
    primary: 'contained',
    secondary: 'outlined',
} as const;

const importanceToColorMapping = {
    primary: 'primary',
    secondary: 'default',
} as const;

function HomeHeader() {
    const navigate = useNavigate();
    const [isBurgerDrawerOpen, setIsBurgerDrawerOpen] = useState(false);
    const jwtToken = localStorage.jwtTokenHandler.get();

    const buttons = computeButtons(jwtToken);
    const renderedButtons = renderButtons(buttons);

    return (
        <>
            <Header
                key="header"
                buttons={renderedButtons}
                LeftContent={
                    <Link to="/">
                        <Logo variant="full" />
                    </Link>
                }
                MiddleContent={
                    <FullMenuContainer key="full-menu-container">
                        {[
                            NAV_LINKS.map((NAV_LINK) => (
                                <LinkContainer key={`${NAV_LINK.to}`}>
                                    <TextLink to={NAV_LINK.to}>
                                        <Typography variant="h5">{NAV_LINK.label}</Typography>
                                    </TextLink>
                                </LinkContainer>
                            )),
                        ]}
                    </FullMenuContainer>
                }
            />
            <BurgerDrawer
                key="burger-drawer"
                close={closeBurgerDrawer}
                isOpen={isBurgerDrawerOpen}
            />
        </>
    );

    function closeBurgerDrawer() {
        setIsBurgerDrawerOpen(false);
    }

    function renderButtons(buttons: headerButtonType[]): React.ReactNode[] {
        return [
            ...buttons.map(({ IconComponent, onClick, title, importance }) => (
                <ButtonWithTextContainer key={`button-${title}`}>
                    <Button
                        onClick={onClick}
                        variant={importanceToVariantMapping[importance]}
                        startIcon={<IconComponent />}
                    >
                        {title}
                    </Button>
                </ButtonWithTextContainer>
            )),
            ...buttons.map(({ IconComponent, onClick, title, importance }) => (
                <IconButtonContainer key={`icon-button-${title}`}>
                    <IconButton
                        color={importanceToColorMapping[importance]}
                        title={title}
                        onClick={onClick}
                        IconComponent={IconComponent}
                    />
                </IconButtonContainer>
            )),
            <BurgerMenuContainer key="burger-menu-container">
                <BurgerMenu
                    toggleDrawer={setIsBurgerDrawerOpen}
                    isDrawerOpen={isBurgerDrawerOpen}
                />
            </BurgerMenuContainer>,
        ];
    }

    function computeButtons(jwtToken: string | undefined): Array<headerButtonType> {
        if (jwtToken) {
            return [
                {
                    IconComponent: LeaderboardIcon,
                    title: 'Tableau de bord',
                    onClick: onGoToDashboardClick,
                    importance: 'primary',
                },
            ];
        }
        return [
            {
                IconComponent: LoginIcon,
                importance: 'secondary',
                onClick: onSignInClick,
                title: 'Se connecter',
            },
            {
                IconComponent: HistoryEduIcon,
                importance: 'primary',
                onClick: onSignUpClick,
                title: 'Créer un compte',
            },
        ];
    }

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

const FullMenuContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },
}));
const LinkContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
}));
const ButtonWithTextContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));

const BurgerMenuContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));
const IconButtonContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

export { HomeHeader };
