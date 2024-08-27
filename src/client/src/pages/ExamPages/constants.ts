import { styled } from '@mui/material';

const BLANK_TEXT_FIELD_WIDTH = 130;

const RightAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.success.main }));
const OkAnswerText = styled('span')(({ theme }) => ({ color: theme.palette.warning.main }));

const textComponentMapping = {
    A: RightAnswerText,
    B: OkAnswerText,
    C: OkAnswerText,
    D: OkAnswerText,
};

const defaultStartText = `L'objectif de ce test est de trouver le cours le plus adapté à votre niveau. Chaque étudiant.e s'engage sur l'honneur à le passer sans utiliser de document et sans faire de recherche en ligne. Le test dure {{duration}} minutes. Faites attention : au-delà des {{duration}} minutes, vos réponses ne sont plus enregistrées. Quand vous avez fini le test, vous pouvez cliquer sur "Terminer l'examen". Si vous ne connaissez pas la réponse à une question, pas de stress : laissez juste la question en blanc.

If you've never studied French, please send an email to Hélène Boisson (helene.boisson@ens.psl.eu).`;

const defaultEndText = `Merci d'avoir répondu au test, vos réponses ont été enregistrées. Vous recevrez un message avant le stage de septembre pour vous indiquer dans quel groupe vous serez.
S'il y a des informations sur vous que vous souhaitez nous faire connaître, ou si vous avez des besoins spécifiques (par exemple dyslexie, troubles de l'attention, autisme...), vous pouvez écrire à Hélène&nbsp;Boisson&nbsp;(helene.boisson@ens.psl.eu).\n\n
Thank you for completing the test, your answers have been saved. You will get an e-mail prior to the intensive in September to let you know which group you will be part of.
If there is any information you would like to share with us or if you have specific needs (for instance dyslexia, ADHD, autism...), you can write an email to Hélène&nbsp;Boisson&nbsp;(helene.boisson@ens.psl.eu)
`;

export { BLANK_TEXT_FIELD_WIDTH, textComponentMapping, defaultEndText, defaultStartText };
