import { styled } from '@mui/material';
import { HEADER_HEIGHT } from '../constants';
import { LoadingButton } from '@mui/lab';
import { IconButton } from './IconButton';

type buttonType = {
    IconComponent: React.ElementType;
    onClick: () => void;
    title: string;
    variant?: 'text-with-icon' | 'icon-only';
    isLoading?: boolean;
};

function Menu(props: { buttons: Array<buttonType> }) {
    return (
        <MenuContainer>
            {props.buttons.map((button, index) => {
                const { IconComponent, onClick, title, isLoading } = button;
                const variant = button.variant || 'text-with-icon';
                if (variant === 'icon-only') {
                    return (
                        <ButtonContainer key={index}>
                            <IconButton
                                IconComponent={IconComponent}
                                title={title}
                                onClick={onClick}
                                isLoading={isLoading}
                            />
                        </ButtonContainer>
                    );
                }
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
