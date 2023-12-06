import { styled } from '@mui/material';
import { HEADER_HEIGHT } from '../constants';
import { LoadingButton } from '@mui/lab';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
    isLoading?: boolean;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            {props.buttons.map((button, index) => {
                const { IconComponent, onClick, title, isLoading } = button;
                return (
                    <ButtonContainer key={index}>
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            startIcon={<IconComponent />}
                            onClick={onClick}
                        >
                            {title}
                        </LoadingButton>
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
