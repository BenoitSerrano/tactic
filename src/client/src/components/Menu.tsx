import React from 'react';
import { IconButton, styled } from '@mui/material';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            {props.buttons.map((button) => {
                const { IconComponent, onClick } = button;
                return (
                    <IconButton onClick={onClick} size="large">
                        <IconComponent fontSize="large" />
                    </IconButton>
                );
            })}
        </MenuContainer>
    );
}

const MENU_CONTAINER_HEIGHT = 80;

const MenuContainer = styled('div')({
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'white',
    width: MENU_CONTAINER_HEIGHT,
    height: MENU_CONTAINER_HEIGHT,
    borderRadius: MENU_CONTAINER_HEIGHT / 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Menu };