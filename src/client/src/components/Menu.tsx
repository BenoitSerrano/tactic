import { styled } from '@mui/material';
import { Button } from './Button';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            <ButtonContainer>
                {props.buttons.map((button, index) => {
                    const { IconComponent, onClick, title } = button;
                    return (
                        <Button
                            key={index}
                            variant="contained"
                            startIcon={<IconComponent />}
                            onClick={onClick}
                        >
                            {title}
                        </Button>
                    );
                })}
            </ButtonContainer>
        </MenuContainer>
    );
}

const BUTTON_CONTAINER_HEIGHT = 80;

const MenuContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: theme.spacing(2),
}));

const ButtonContainer = styled('div')({
    minWidth: BUTTON_CONTAINER_HEIGHT,
    height: BUTTON_CONTAINER_HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

export { Menu };
