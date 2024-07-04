import { IconButton } from '../../components/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function BurgerMenu(props: {
    toggleDrawer: (isDrawerOpen: boolean) => void;
    isDrawerOpen: boolean;
}) {
    if (props.isDrawerOpen) {
        return <IconButton IconComponent={CloseIcon} onClick={closeDrawer} title="Ferme le menu" />;
    } else {
        return <IconButton IconComponent={MenuIcon} onClick={openDrawer} title="Ouvrir le menu" />;
    }

    function closeDrawer() {
        props.toggleDrawer(false);
    }

    function openDrawer() {
        props.toggleDrawer(true);
    }
}

export { BurgerMenu };
