import { styled } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Button } from '../../../components/Button';

function OverallTableHeader() {
    return (
        <Container>
            <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />}>
                Ajouter un établissement
            </Button>
        </Container>
    );
}

export { OverallTableHeader };

const Container = styled('div')(({ theme }) => ({ display: 'flex', justifyContent: 'end' }));
