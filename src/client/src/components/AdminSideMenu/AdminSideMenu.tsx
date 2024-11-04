import Diversity3Icon from '@mui/icons-material/Diversity3';
import ArticleIcon from '@mui/icons-material/Article';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import InventoryIcon from '@mui/icons-material/Inventory';
import { styled } from '@mui/material';
import { pathHandler } from '../../lib/pathHandler';
import { SideItemMenu } from './SideItemMenu';

function AdminSideMenu() {
    return (
        <Container>
            <SideItemMenu
                level="high"
                title="Mes examens"
                IconComponent={ArticleIcon}
                path={pathHandler.getRoutePath('EXAM_LIST')}
            />
            <SideItemMenu
                level="low"
                title="En cours"
                IconComponent={HistoryEduIcon}
                path={pathHandler.getRoutePath('EXAM_LIST_CURRENT')}
            />
            <SideItemMenu
                level="low"
                title="Archivés"
                IconComponent={InventoryIcon}
                path={pathHandler.getRoutePath('EXAM_LIST_ARCHIVED')}
            />
            <SideItemMenu
                level="high"
                title="Mes classes"
                IconComponent={Diversity3Icon}
                path={pathHandler.getRoutePath('CLASSES')}
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
