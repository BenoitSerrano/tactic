import { styled } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '../../../components/IconButton';
import { viewModeType } from './constants';

function EditionActionMenu(props: {
    currentViewMode: viewModeType;
    setCurrentViewMode: (viewMode: viewModeType) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    isSaving: boolean;
    isDeleting: boolean;
}) {
    if (props.currentViewMode === 'editing') {
        return (
            <MenuCenterContainer>
                <IconButton
                    isLoading={props.isSaving}
                    onClick={props.onSave}
                    IconComponent={SaveIcon}
                    title="Sauvegarder les changements"
                    color="success"
                />
                <IconButton
                    onClick={props.onCancel}
                    IconComponent={ClearIcon}
                    title="Annuler les changements"
                />
            </MenuCenterContainer>
        );
    }
    return (
        <MenuRightContainer>
            <IconButton
                onClick={setEditingMode}
                IconComponent={EditIcon}
                title="Éditer la question"
            />
            <IconButton
                isLoading={props.isDeleting}
                onClick={props.onDelete}
                IconComponent={DeleteForeverIcon}
                title="Supprimer la question"
                color="error"
            />
        </MenuRightContainer>
    );

    function setEditingMode() {
        props.setCurrentViewMode('editing');
    }
}

const mainMenuProperties = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    width: '100%',
};

const MenuRightContainer = styled('div')({
    ...mainMenuProperties,
    alignItems: 'flex-start',
});

const MenuCenterContainer = styled('div')({
    ...mainMenuProperties,
    alignItems: 'center',
});

export { EditionActionMenu };
