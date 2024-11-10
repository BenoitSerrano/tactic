import { styled } from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '../../../components/Button';

function ClasseTableHeader() {
    return (
        <Container>
            <Button variant="outlined" startIcon={<EditNoteOutlinedIcon />}>
                Modifier la classe
            </Button>
        </Container>
    );
}

export { ClasseTableHeader };

const Container = styled('div')(({ theme }) => ({ display: 'flex', justifyContent: 'end' }));
