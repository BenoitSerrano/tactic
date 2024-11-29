import { styled, TextField, Typography } from '@mui/material';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { FormEvent, useState } from 'react';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';

const TITLES_SM_UP_WIDTH = '80%';
const TITLES_SM_DOWN_WIDTH = '90%';
const FORM_MD_UP_WIDTH = '30%';
const FORM_MD_DOWN_WIDTH = '80%';

function LandingPageHeader() {
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();

    return (
        <Container>
            <Title variant="h1">Gagnez du temps en automatisant la correction de vos copies</Title>
            <Subtitle variant="h2">
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
    paddingBottom: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
        width: TITLES_SM_UP_WIDTH,
    },
    [theme.breakpoints.down('sm')]: {
        width: TITLES_SM_DOWN_WIDTH,
    },
}));
const Subtitle = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(3),

    [theme.breakpoints.up('sm')]: {
        width: TITLES_SM_UP_WIDTH,
    },
    [theme.breakpoints.down('sm')]: {
        width: TITLES_SM_DOWN_WIDTH,
    },
}));
const FormContainer = styled('form')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: FORM_MD_UP_WIDTH,
    },
    [theme.breakpoints.down('md')]: {
        width: FORM_MD_DOWN_WIDTH,
    },
    display: 'flex',
    flexDirection: 'column',
}));
const EmailInput = styled(TextField)(({ theme }) => ({
    background: 'white',
    flex: 1,
    marginBottom: theme.spacing(1),
}));

export { LandingPageHeader };
