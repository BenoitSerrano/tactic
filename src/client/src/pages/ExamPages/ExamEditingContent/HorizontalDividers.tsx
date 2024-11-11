import { styled } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '../../../components/Button';

const BUTTON_HEIGHT = 40;

function HorizontalDividerToAddExercise(props: { onClick: () => void }) {
    return (
        <HorizontalDividerWithButton
            button={{
                variant: 'outlined',
                label: 'Ajouter un exercice',
                IconComponent: AddCircleOutlineIcon,
                onClick: props.onClick,
            }}
        />
    );
}

function HorizontalDividerToAddQuestion(props: { onClick: () => void }) {
    return (
        <HorizontalDividerWithButton
            button={{
                position: 'center',
                variant: 'text',
                label: 'Ajouter une question',
                IconComponent: AddCircleOutlineIcon,
                onClick: props.onClick,
            }}
        />
    );
}

function HorizontalDividerWithButton(props: {
    button: {
        position?: 'left' | 'center';
        variant: 'text' | 'outlined';
        onClick: () => void;
        IconComponent: React.ElementType;
        label: string;
    };
}) {
    const { button } = props;
    const { IconComponent } = button;
    const position = button.position || 'center';
    const MainContainer = mainContainerMapping[position];
    return (
        <MainContainer>
            <ButtonContainer>
                <Button
                    color="inherit"
                    variant={button.variant}
                    onClick={button.onClick}
                    startIcon={<IconComponent />}
                >
                    {button.label}
                </Button>
            </ButtonContainer>
        </MainContainer>
    );
}

export { HorizontalDividerToAddExercise, HorizontalDividerToAddQuestion };

const mainContainerProperties = {
    width: '100%',
    height: 1,
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginTop: BUTTON_HEIGHT / 2,
    marginBottom: BUTTON_HEIGHT / 2,
};

const LeftContainer = styled('div')(({ theme }) => ({
    ...mainContainerProperties,
    justifyContent: 'flex-start',
    backgroundColor: `${theme.palette.common.black}`,
}));

const CenterContainer = styled('div')(({ theme }) => ({
    ...mainContainerProperties,
    justifyContent: 'center',
    backgroundColor: `${theme.palette.common.black}`,
}));

const ButtonContainer = styled('div')({
    zIndex: 1,
    height: BUTTON_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
});

const mainContainerMapping = {
    center: CenterContainer,
    left: LeftContainer,
};
