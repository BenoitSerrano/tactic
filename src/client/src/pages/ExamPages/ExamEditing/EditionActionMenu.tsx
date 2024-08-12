import { styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '../../../components/IconButton';

function EditionActionMenu(props: {
    onDelete: () => void;
    isDeleting: boolean;
    openEditingModal: () => void;
}) {
    return (
        <MenuRightContainer>
            <IconButton
                onClick={props.openEditingModal}
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
}

const MenuRightContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
});

export { EditionActionMenu };
