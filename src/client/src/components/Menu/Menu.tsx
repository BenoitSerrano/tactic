import { styled } from '@mui/material';
import { HEADER_HEIGHT } from '../../constants';
import { MenuButton } from './MenuButton';

type buttonVariantType = 'text-with-icon' | 'icon-only';

type popupMenuOptionType = {
    IconComponent: React.ElementType;
    label: string;
    onClick: () => void;
};

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
    shape?: 'outlined' | 'contained';
    variant?: buttonVariantType;
    isLoading?: boolean;
    popupMenu?: Array<popupMenuOptionType>;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            {props.buttons.map((button, index) => {
                return (
                    <ButtonContainer key={index}>
                        <MenuButton button={button} />
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
    alignItems: 'center',
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
