import { Typography } from '@mui/material';
import { attemptActionEncoder } from '../lib/attemptActionEncoder';
import { pathHandler } from '../lib/pathHandler';
import { useAlert } from '../lib/alert';
import { config } from '../config';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Link } from '../components/Link';

function ExamCollect() {
    const { displayAlert } = useAlert();
    const params = useParams();
    const url = computeUrl(params.examId as string);
    return (
        <div>
            <Typography variant="h3">Comment voulez-vous collecter les réponses ?</Typography>
            <Typography variant="h4">Adresse web de votre examen</Typography>
            <Typography variant="h6">
                Cliquez sur le bouton ci-dessous pour copier le lien à envoyer à vos étudiant.es.
            </Typography>
            <Button variant="contained" onClick={copyUrlToClipboard}>
                Copier
            </Button>
            <Typography variant="h6">
                Vos étudiant.es arriveront sur une page où iels devront rentrer leur email
                d'identification. Pour gérer vos groupes d'étudiant.es, cliquez{' '}
                <Link to={pathHandler.getRoutePath('GROUPS')}>ici</Link>.
            </Typography>
        </div>
    );

    async function copyUrlToClipboard() {
        try {
            await navigator.clipboard.writeText(url);
            displayAlert({
                text: 'Le lien a bien été copié dans le presse-papiers',
                variant: 'success',
            });
        } catch (error) {
            console.error(error);
            displayAlert({
                autoHideDuration: null,
                variant: 'error',
                text: `Le lien n'a pas pu être copié dans le presse-papiers.`,
            });
        }
    }

    function computeUrl(examId: string) {
        const encodedAction = attemptActionEncoder.encode('take');
        const path = pathHandler.getRoutePath('STUDENT_AUTHENTICATION', {
            examId,
            encodedAction,
        });
        const url = `${config.HOST_URL}${path}`;
        return url;
    }
}

export { ExamCollect };
