import { Typography, styled } from '@mui/material';
import { Link } from '../Link';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { pathHandler } from '../../lib/pathHandler';

function OverallSideItemMenu() {
    const path = pathHandler.getRoutePath('EXAM_LIST_FOR_ALL');
    return (
        <Container>
            <Link to={path}>
                <LinkContent>
                    <Typography variant="h5">Tous mes examens</Typography>
                </LinkContent>
            </Link>
        </Container>
    );
}

function EstablishmentSideItemMenu(props: { establishment: { id: string; name: string } }) {
    const path = pathHandler.getRoutePath('ESTABLISHMENT', {
        establishmentId: props.establishment.id,
    });
    return (
        <Container>
            <Link to={path}>
                <LinkContent>
                    <IconContainer>
                        <AccountBalanceOutlinedIcon fontSize={'medium'} />
                    </IconContainer>
                    <Typography variant="h5">{props.establishment.name}</Typography>
                </LinkContent>
            </Link>
        </Container>
    );
}

function ClasseSideItemMenu(props: {
    establishmentId: string;
    classe: { id: string; name: string };
}) {
    const path = pathHandler.getRoutePath('EXAM_LIST_FOR_CLASSE', {
        establishmentId: props.establishmentId,
        classeId: props.classe.id,
    });
    return (
        <Container>
            <Link to={path}>
                <LinkContent>
                    <IconContainer>
                        <FolderOutlinedIcon fontSize="small" />
                    </IconContainer>
                    <Typography variant="h6">{props.classe.name}</Typography>
                </LinkContent>
            </Link>
        </Container>
    );
}

export { EstablishmentSideItemMenu, ClasseSideItemMenu, OverallSideItemMenu };

const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));

const LinkContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const Container = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
