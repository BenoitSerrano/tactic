import React from 'react';
import { IconButton, styled } from '@mui/material';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title?: string;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            <ButtonContainer>
                {props.buttons.map((button, index) => {
                    const { IconComponent, onClick } = button;
                    return (
                        <IconButton
                            title={button.title}
                            onClick={onClick}
                            size="large"
                            key={`menuButton-${index}`}
                        >
                            <IconComponent fontSize="large" />
                        </IconButton>
                    );
                })}
            </ButtonContainer>
        </MenuContainer>
    );
}

const BUTTON_CONTAINER_HEIGHT = 80;

const MenuContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
});

const ButtonContainer = styled('div')({
    minWidth: BUTTON_CONTAINER_HEIGHT,
    height: BUTTON_CONTAINER_HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Menu };
