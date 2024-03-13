import Diversity3Icon from '@mui/icons-material/Diversity3';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/material';
import { pathHandler } from '../../lib/pathHandler';
import { SideItemMenu } from './SideItemMenu';

function AdminSideMenu() {
    return (
        <Container>
            <SideItemMenu
                title="Mes examens"
                IconComponent={SchoolIcon}
                path={pathHandler.getRoutePath('EXAM_LIST')}
            />
            <SideItemMenu
                title="Mes groupes"
                IconComponent={Diversity3Icon}
                path={pathHandler.getRoutePath('GROUPS')}
            />
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '25%',
    paddingLeft: theme.spacing(2),
    flexDirection: 'column',
}));

export { AdminSideMenu };
