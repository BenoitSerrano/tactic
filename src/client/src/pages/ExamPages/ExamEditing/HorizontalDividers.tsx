import { styled } from '@mui/material';
import { IconButton } from '../../../components/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ICON_SIZE = 40;

function HorizontalDividerToAddExercise(props: { onClick: () => void }) {
    return (
        <HorizontalDividerWithIcon
            onClick={props.onClick}
            IconComponent={AddCircleOutlineIcon}
            buttonTooltip="Ajouter un exercice"
        />
    );
}

function HorizontalDividerWithIcon(props: {
    onClick: () => void;
    IconComponent: React.ElementType;
    buttonTooltip: string;
}) {
    return (
        <Container>
            <IconContainer>
                <IconButton
                    IconComponent={props.IconComponent}
                    title={props.buttonTooltip}
                    onClick={props.onClick}
                />
            </IconContainer>
        </Container>
    );
}

export { HorizontalDividerToAddExercise };

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
    width: ICON_SIZE,
    backgroundColor: 'white',
});
