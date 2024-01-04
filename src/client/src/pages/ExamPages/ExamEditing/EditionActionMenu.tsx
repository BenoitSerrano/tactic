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
            <MenuContainer>
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
            </MenuContainer>
        );
    }
    return (
        <MenuContainer>
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
            />
        </MenuContainer>
    );

    function setEditingMode() {
        props.setCurrentViewMode('editing');
    }
}

const MenuContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

export { EditionActionMenu };
