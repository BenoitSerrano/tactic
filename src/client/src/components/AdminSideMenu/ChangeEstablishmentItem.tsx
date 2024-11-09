import { styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function ChangeEstablishmentItem(props: {
    name: string;
    id: string;
    isSelected: boolean;
    closeModal: () => void;
}) {
    const navigate = useNavigate();
    return (
        <Container onClick={onClick} isSelected={props.isSelected}>
            {props.name}
        </Container>
    );

    function onClick() {
        const path = pathHandler.getRoutePath('EXAM_LIST', { establishmentId: props.id });

        navigate(path);
        props.closeModal();
    }
}

export { ChangeEstablishmentItem };

const Container = styled(Typography)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    borderLeft: `solid 4px`,
    borderRadius: '2px',
    backgroundColor: isSelected ? theme.palette.background.default : 'white',

    borderLeftColor: isSelected ? theme.palette.primary.main : 'white',
    '&:hover': {
        cursor: 'pointer',
        borderColor: isSelected ? theme.palette.primary.main : theme.palette.background.default,
        backgroundColor: theme.palette.background.default,
    },
}));
