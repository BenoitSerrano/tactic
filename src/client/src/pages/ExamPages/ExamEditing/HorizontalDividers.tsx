import { styled } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '../../../components/Button';

const ICON_SIZE = 40;

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
        variant: 'text' | 'outlined';
        onClick: () => void;
        IconComponent: React.ElementType;
        label: string;
    };
}) {
    const { button } = props;
    const { IconComponent } = button;
    return (
        <Container>
            <IconContainer>
                <Button
                    color="inherit"
                    variant={button.variant}
                    onClick={button.onClick}
                    startIcon={<IconComponent />}
                >
                    {button.label}
                </Button>
            </IconContainer>
        </Container>
    );
}

export { HorizontalDividerToAddExercise, HorizontalDividerToAddQuestion };

const Container = styled('div')(({ theme }) => ({
    width: '100%',
    height: 1,
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.palette.common.black}`,
    position: 'relative',
    marginTop: ICON_SIZE / 2,
    marginBottom: ICON_SIZE / 2,
}));

const IconContainer = styled('div')({
    position: 'absolute',
    zIndex: 1,
    top: -ICON_SIZE / 2,
    height: ICON_SIZE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
});
