import { styled, Typography } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GradingIcon from '@mui/icons-material/Grading';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GroupsIcon from '@mui/icons-material/Groups';
import { IconButton } from '../../components/IconButton';
import { pathHandler } from '../../lib/pathHandler';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';
import { Card } from '../../components/Card';

function ClasseRow(props: { classe: { id: string; name: string } }) {
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const deleteClasseMutation = useMutation({
        mutationFn: api.deleteClasse,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'La classe a été supprimée.' });
            queryClient.invalidateQueries({ queryKey: ['establishments', 'with-classes'] });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. La classe n'a pas pu être supprimée.",
            });
        },
    });
    return (
        <Card>
            <Container>
                <Name>
                    <IconContainer>
                        <GroupsIcon />
                    </IconContainer>
                    {props.classe.name}
                </Name>
                <ButtonsContainer>
                    <ButtonContainer>
                        <IconButton
                            onClick={navigateToStudents}
                            IconComponent={GroupAddIcon}
                            title="Ajouter / supprimer des élèves"
                        />
                    </ButtonContainer>
                    <ButtonContainer>
                        <IconButton
                            onClick={navigateToStudents}
                            IconComponent={GradingIcon}
                            title="Voir toutes les notes"
                        />
                    </ButtonContainer>
                    <ButtonContainer>
                        <IconButton
                            color="error"
                            onClick={onDeleteClick}
                            IconComponent={DeleteForeverIcon}
                            title="Supprimer la classe"
                        />
                    </ButtonContainer>
                </ButtonsContainer>
            </Container>
        </Card>
    );

    function onDeleteClick() {
        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            'Souhaitez-vous réellement supprimer cette classe ? Les élèves et leurs résultats aux examens seront supprimés.',
        );
        if (hasConfirmed) {
            deleteClasseMutation.mutate({ classeId: props.classe.id });
        }
    }

    function navigateToStudents() {
        navigate(pathHandler.getRoutePath('STUDENTS', { classeId: props.classe.id }));
    }
}

const IconContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(1) }));
const Name = styled(Typography)(({ theme }) => ({
    flex: 1,
    display: 'flex',
}));
const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));
const ButtonsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));
const ButtonContainer = styled('div')(({ theme }) => ({}));
export { ClasseRow };
