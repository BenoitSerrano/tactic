import { ButtonGroup, styled } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '../../../components/Button';

const BUTTON_HEIGHT = 40;

function HorizontalDividerToAddExercise(props: {
    onCreateExerciseClick: () => void;
    onImportExerciseClick: () => void;
}) {
    return (
        <HorizontalDividerWithButton
            buttons={[
                {
                    variant: 'contained',
                    label: 'Créer un exercice',
                    IconComponent: AddCircleOutlineIcon,
                    iconPlacement: 'left',
                    onClick: props.onCreateExerciseClick,
                },
                {
                    variant: 'outlined',
                    label: 'Importer un exercice déjà créé',
                    IconComponent: FileDownloadIcon,
                    iconPlacement: 'right',
                    onClick: props.onImportExerciseClick,
                },
            ]}
        />
    );
}

function HorizontalDividerToAddQuestion(props: { onClick: () => void }) {
    return (
        <HorizontalDividerWithButton
            buttons={[
                {
                    iconPlacement: 'left',
                    variant: 'text',
                    label: 'Ajouter une question',
                    IconComponent: AddCircleOutlineIcon,
                    onClick: props.onClick,
                },
            ]}
        />
    );
}

function HorizontalDividerWithButton(props: {
    buttons: Array<{
        variant: 'text' | 'outlined' | 'contained';
        onClick: () => void;
        IconComponent: React.ElementType;
        label: string;
        iconPlacement: 'right' | 'left';
    }>;
}) {
    const { buttons } = props;
    return (
        <CenterContainer>
            <ButtonContainer>
                <ButtonGroup>
                    {buttons.map((button) => (
                        <Button
                            key={button.label}
                            color="primary"
                            variant={button.variant}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </ButtonContainer>
        </CenterContainer>
    );
}

export { HorizontalDividerToAddExercise, HorizontalDividerToAddQuestion };

const CenterContainer = styled('div')(({ theme }) => ({
    width: '100%',
    height: 1,
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginTop: BUTTON_HEIGHT / 2,
    marginBottom: BUTTON_HEIGHT / 2,
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
