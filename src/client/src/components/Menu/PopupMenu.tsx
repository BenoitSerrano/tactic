import { ListItemIcon, ListItemText } from '@mui/material';
import { popupMenuOptionType } from './types';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';

function PopupMenu(props: {
    popupMenuOptions: popupMenuOptionType[];
    anchorEl: Element | null;
    isOpen: boolean;
    close: () => void;
}) {
    return (
        <MuiMenu
            id="basic-menu"
            anchorEl={props.anchorEl}
            open={props.isOpen}
            onClose={props.close}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {props.popupMenuOptions.map((popupMenuOption) => (
                <MuiMenuItem
                    key={popupMenuOption.label}
                    onClick={() => {
                        popupMenuOption.onClick();
                        props.close();
                    }}
                >
                    <ListItemIcon>
                        <popupMenuOption.IconComponent />
                    </ListItemIcon>
                    <ListItemText>{popupMenuOption.label}</ListItemText>
                </MuiMenuItem>
            ))}
        </MuiMenu>
    );
}

export { PopupMenu };
