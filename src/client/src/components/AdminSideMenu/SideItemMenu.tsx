import { Typography, styled } from '@mui/material';
import { Link } from '../Link';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import { pathHandler } from '../../lib/pathHandler';

function EstablishmentSideItemMenu(props: {
    establishment: { id: string; name: string };
    isActive: boolean;
}) {
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
                    <Text isActive={props.isActive} variant="h5">
                        {props.establishment.name}
                    </Text>
                </LinkContent>
            </Link>
        </Container>
    );
}

function ClasseSideItemMenu(props: {
    establishmentId: string;
    classe: { id: string; name: string };
    isActive: boolean;
}) {
    const path = pathHandler.getRoutePath('CLASSE', {
        establishmentId: props.establishmentId,
        classeId: props.classe.id,
    });
    return (
        <Container>
            <Link to={path}>
                <LinkContent>
                    <IconContainer>
                        <GroupsIcon fontSize="small" />
                    </IconContainer>
                    <Text isActive={props.isActive} variant="h6">
                        {props.classe.name}
                    </Text>
                </LinkContent>
            </Link>
        </Container>
    );
}

export { EstablishmentSideItemMenu, ClasseSideItemMenu };

const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));

const Text = styled(Typography)<{ isActive: boolean }>(({ theme, isActive }) => ({
    fontWeight: isActive ? 'bold' : undefined,
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
