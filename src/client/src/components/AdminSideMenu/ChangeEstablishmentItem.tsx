import { styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';
import { establishmentType } from './types';
import { IconButton } from '../IconButton';
import EditIcon from '@mui/icons-material/Edit';

function ChangeEstablishmentItem(props: {
    establishment: establishmentType;
    onEditClick: (establishment: establishmentType) => void;
    isSelected: boolean;
    closeModal: () => void;
}) {
    const navigate = useNavigate();
    return (
        <Container onClick={onClick} isSelected={props.isSelected}>
            <Typography>{props.establishment.name}</Typography>
            <IconButton
                IconComponent={EditIcon}
                onClick={onEditClick}
                title="Éditer l'établissement"
            />
        </Container>
    );

    function onClick() {
        const path = pathHandler.getRoutePath('EXAM_LIST', {
            establishmentId: props.establishment.id,
        });

        navigate(path);
        props.closeModal();
    }

    function onEditClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        props.onEditClick(props.establishment);
        props.closeModal();
    }
}

export { ChangeEstablishmentItem };

const Container = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    borderLeft: `solid 4px`,
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isSelected ? theme.palette.background.default : 'white',

    borderLeftColor: isSelected ? theme.palette.primary.main : 'white',
    '&:hover': {
        cursor: 'pointer',
        borderColor: isSelected ? theme.palette.primary.main : theme.palette.background.default,
        backgroundColor: theme.palette.background.default,
    },
}));
