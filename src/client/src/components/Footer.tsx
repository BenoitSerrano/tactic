import { styled } from '@mui/material';
import { Logo } from './Logo';
import { TextLink } from './TextLink';
import { pathHandler } from '../lib/pathHandler';

function Footer() {
    return (
        <Container>
            <TopContainer>
                <Logo variant="full" />
            </TopContainer>
            <BottomContainer>
                <LinkContainerWithRightBorder>
                    <TextLink
                        to={pathHandler.getRoutePath('TERMS_AND_CONDITIONS')}
                        label="Mentions légales"
                    />
                </LinkContainerWithRightBorder>
                <LinkContainerWithRightBorder>
                    <TextLink
                        to={pathHandler.getRoutePath('PRIVACY')}
                        label="Données personnelles"
                    />
                </LinkContainerWithRightBorder>
                <LinkContainerWithoutRightBorder>
                    <TextLink to={pathHandler.getRoutePath('FAQ')} label="FAQ" />
                </LinkContainerWithoutRightBorder>
            </BottomContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),

    backgroundColor: 'white',
    borderTop: `${theme.palette.divider} 1px solid`,
}));

const TopContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});
const LinkContainerWithRightBorder = styled('div')(({ theme }) => ({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRight: `solid 1px ${theme.palette.divider}`,
}));
const LinkContainerWithoutRightBorder = styled('div')(({ theme }) => ({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
}));
const BottomContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
    display: 'flex',
}));

export { Footer };
