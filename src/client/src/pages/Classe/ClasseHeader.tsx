import { styled, Tooltip, Typography } from '@mui/material';
import { Card } from '../../components/Card';
import GradingIcon from '@mui/icons-material/Grading';
import GroupIcon from '@mui/icons-material/Group';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button } from '../../components/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';
import { EditableName } from './EditableName';

function ClasseHeader(props: {
    studentsCount: number;
    establishment: { id: string; name: string };
    classe: { id: string; name: string };
}) {
    const navigate = useNavigate();
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const deleteClasseMutation = useMutation({
        mutationFn: api.deleteClasse,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'La classe a été supprimée.' });
            queryClient.invalidateQueries({ queryKey: ['establishments'] });
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
        <Card style={{ width: '100%' }}>
            <ContentContainer>
                <InfoContainer>
                    <EditableName classe={props.classe} />
                    <Typography variant="h5">{props.establishment.name}</Typography>
                    <StudentInfoContainer>
                        <IconContainer title="Nombre d'élèves">
                            <GroupIcon />
                        </IconContainer>
                        <Typography>
                            {props.studentsCount} élève{props.studentsCount > 1 && 's'}
                        </Typography>
                    </StudentInfoContainer>
                </InfoContainer>
                <ButtonsContainer>
                    <ButtonContainer>
                        <Button
                            onClick={navigateToStudents}
                            variant="outlined"
                            startIcon={<GroupAddIcon />}
                        >
                            Ajouter / supprimer des élèves
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            onClick={navigateToStudents}
                            startIcon={<GradingIcon />}
                            variant="outlined"
                        >
                            Voir toutes les notes
                        </Button>
                    </ButtonContainer>
                    <ButtonContainer>
                        <Button
                            onClick={onDeleteClick}
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteForeverIcon />}
                        >
                            Supprimer la classe
                        </Button>
                    </ButtonContainer>
                </ButtonsContainer>
            </ContentContainer>
        </Card>
    );

    function navigateToStudents() {
        navigate(pathHandler.getRoutePath('STUDENTS', { classeId: props.classe.id }));
    }

    function onDeleteClick() {
        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            'Souhaitez-vous réellement supprimer cette classe ? Les élèves et leurs résultats aux examens seront supprimés.',
        );
        if (hasConfirmed) {
            deleteClasseMutation.mutate({ classeId: props.classe.id });
        }
    }
}
const ContentContainer = styled('div')(({ theme }) => ({ display: 'flex' }));
const StudentInfoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingTop: theme.spacing(1),
}));
const InfoContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
}));
const IconContainer = styled(Tooltip)(({ theme }) => ({ marginRight: theme.spacing(1) }));
const ButtonsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'end',
}));
const ButtonContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
export { ClasseHeader };
