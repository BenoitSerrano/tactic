import { LoadingButton } from '@mui/lab';
import { IconButton } from '../IconButton';
import { PopupMenu } from './PopupMenu';
import { buttonType, buttonVariantType } from './types';
import { useState } from 'react';

function MenuButton(props: { button: buttonType }) {
    const { IconComponent, title, isLoading } = props.button;
    const shape = props.button.shape || 'contained';
    const variant: buttonVariantType = props.button.variant || 'text-with-icon';
    const [popupMenuAnchorEl, setPopupMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isPopupMenuOpen = Boolean(popupMenuAnchorEl);

    if (variant === 'icon-only') {
        return (
            <>
                {!!props.button.popupMenu && (
                    <PopupMenu
                        anchorEl={popupMenuAnchorEl}
                        close={closePopupMenu}
                        isOpen={isPopupMenuOpen}
                        popupMenuOptions={props.button.popupMenu}
                    />
                )}
                <IconButton
                    IconComponent={IconComponent}
                    title={title}
                    onClick={onClick}
                    isLoading={isLoading}
                />
            </>
        );
    }
    return (
        <>
            {!!props.button.popupMenu && (
                <PopupMenu
                    anchorEl={popupMenuAnchorEl}
                    close={closePopupMenu}
                    isOpen={isPopupMenuOpen}
                    popupMenuOptions={props.button.popupMenu}
                />
            )}
            <LoadingButton
                loading={isLoading}
                variant={shape}
                startIcon={<IconComponent />}
                onClick={onClick}
            >
                {title}
            </LoadingButton>
        </>
    );
    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (props.button.popupMenu) {
            openPopupMenu(event);
        }
        props.button.onClick();
    }

    function openPopupMenu(event: React.MouseEvent<HTMLButtonElement>) {
        setPopupMenuAnchorEl(event.currentTarget);
    }

    function closePopupMenu() {
        setPopupMenuAnchorEl(null);
    }
}

export { MenuButton };
