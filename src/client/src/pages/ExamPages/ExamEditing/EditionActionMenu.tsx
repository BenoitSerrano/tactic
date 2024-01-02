import { styled } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '../../../components/IconButton';
import { viewModeType } from './constants';

function EditionActionMenu(props: {
    currentViewMode: viewModeType;
    setCurrentViewMode: (viewMode: viewModeType) => void;
    onSave: () => void;
    isSaving: boolean;
    isSaveButtonDisabled: boolean;
}) {
    if (props.currentViewMode === 'editing') {
        return (
            <MenuContainer>
                <IconButton
                    onClick={setEditingMode}
                    IconComponent={DeleteForeverIcon}
                    title="Supprimer la question"
                />
                <IconButton
                    isLoading={props.isSaving}
                    onClick={props.onSave}
                    IconComponent={SaveIcon}
                    disabled={props.isSaveButtonDisabled}
                    title="Sauvegarder les changements"
                    color="success"
                />
            </MenuContainer>
        );
    }
    return (
        <MenuContainer>
            <IconButton
                onClick={setEditingMode}
                IconComponent={DeleteForeverIcon}
                title="Supprimer la question"
            />
            <IconButton
                onClick={setEditingMode}
                IconComponent={EditIcon}
                title="Éditer la question"
            />
        </MenuContainer>
    );

    function setEditingMode() {
        props.setCurrentViewMode('editing');
    }
}

const MenuContainer = styled('div')({});

export { EditionActionMenu };
