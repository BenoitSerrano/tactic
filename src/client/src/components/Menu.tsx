import { styled } from '@mui/material';
import { Button } from './Button';
import { HEADER_HEIGHT } from '../constants';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            {props.buttons.map((button, index) => {
                const { IconComponent, onClick, title } = button;
                return (
                    <ButtonContainer>
                        <Button
                            key={index}
                            variant="contained"
                            startIcon={<IconComponent />}
                            onClick={onClick}
                        >
                            {title}
                        </Button>
                    </ButtonContainer>
                );
            })}
        </MenuContainer>
    );
}

const BUTTON_CONTAINER_HEIGHT = 80;

const MenuContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    zIndex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'fixed',
    right: 0,
    top: HEADER_HEIGHT,
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(3),
}));

const ButtonContainer = styled('div')({
    minWidth: BUTTON_CONTAINER_HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Menu };
