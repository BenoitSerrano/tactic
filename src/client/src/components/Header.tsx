import { styled } from '@mui/material';
import { Logo } from './Logo';
import { Link } from './Link';
import { HEADER_HEIGHT } from '../constants';

function Header(props: { logoLink?: string; buttons: Array<JSX.Element>; title?: JSX.Element }) {
    return (
        <FixedContainer>
            <ContentContainer>
                {props.logoLink ? (
                    <Link to={props.logoLink}>
                        <Logo variant="full" />
                    </Link>
                ) : (
                    <Logo variant="full" />
                )}
                <TitleContainer>{props.title}</TitleContainer>

                <ButtonsContainer>{props.buttons}</ButtonsContainer>
            </ContentContainer>
        </FixedContainer>
    );
}

const FixedContainer = styled('div')(({ theme }) => ({
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    top: 0,
    position: 'fixed',
    width: '100vw',
    zIndex: 2,
    borderBottom: `${theme.palette.divider} 1px solid`,
}));
const ContentContainer = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
const TitleContainer = styled('div')({ display: 'flex' });

const ButtonsContainer = styled('div')({ display: 'flex' });

export { Header };
