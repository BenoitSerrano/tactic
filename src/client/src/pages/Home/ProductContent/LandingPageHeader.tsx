import { styled, TextField, Typography } from '@mui/material';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { FormEvent, useState } from 'react';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';

const TITLES_WIDTH = '80%';
const FORM_WIDTH = '30%';

function LandingPageHeader() {
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();

    return (
        <Container>
            <Title variant="h1">Gagnez du temps en automatisant la correction de vos copies</Title>
            <Subtitle variant="h3">
                Créez et faites passer vos examens sur une seule plateforme. Avec Tactic, vous
                divisez en moyenne par 3 votre temps de correction.
            </Subtitle>
            <FormContainer onSubmit={handleSubmit}>
                <EmailInput
                    type="email"
                    placeholder="Adresse e-mail"
                    value={newEmail}
                    onChange={onChangeEmail}
                />
                <Button startIcon={<HistoryEduIcon />} type="submit" variant="contained">
                    Créer un compte gratuit
                </Button>
            </FormContainer>
        </Container>
    );

    function onChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setNewEmail(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigate(pathHandler.getRoutePath('SIGN_UP', {}, { email: newEmail }));
    }
}
const Container = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    width: TITLES_WIDTH,
}));
const Subtitle = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(3),

    width: TITLES_WIDTH,
}));
const FormContainer = styled('form')(({ theme }) => ({
    width: FORM_WIDTH,
    display: 'flex',
    flexDirection: 'column',
}));
const EmailInput = styled(TextField)(({ theme }) => ({
    background: 'white',
    flex: 1,
    marginBottom: theme.spacing(1),
}));

export { LandingPageHeader };
