import { styled } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '../../../components/Button';

function EstablishmentTableHeader() {
    return (
        <Container>
            <ButtonContainer>
                <Button variant="outlined" startIcon={<EditNoteOutlinedIcon />}>
                    Modifier l'établissement
                </Button>
            </ButtonContainer>
            <ButtonContainer>
                <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />}>
                    Ajouter une classe
                </Button>
            </ButtonContainer>
        </Container>
    );
}

export { EstablishmentTableHeader };

const Container = styled('div')(({ theme }) => ({ display: 'flex', justifyContent: 'end' }));
const ButtonContainer = styled('div')(({ theme }) => ({ marginLeft: theme.spacing(1) }));
