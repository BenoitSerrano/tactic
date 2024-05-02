import { ROUTE_KEYS } from './routeKeys';

const ROUTE_TITLES: Record<(typeof ROUTE_KEYS)[number], string> = {
    EXAM_TAKING: 'Examen en cours',
    STUDENT_HOME: 'Accueil étudiant',
    STUDENT_AUTHENTICATION: 'Connexion étudiant',
    RESET_PASSWORD_FAILURE: 'Échec de réinitialisation du mot de passe',
    RESET_PASSWORD_SUCCESS: 'Mot de passe réinitialisé',
    RESET_PASSWORD_REQUESTED: 'Demande de réinitialisation de mot de passe envoyée',
    RESET_PASSWORD: 'Réinitialisation mot de passe',
    REQUEST_RESET_PASSWORD: 'Demande de réinitialisation de mot de passe',
    SIGN_IN: 'Connexion',
    SIGN_UP: 'Inscription',
    HOME: 'Accueil',
    EXAM_CONSULTING: 'Consultation de copie',
    EXAM_DONE: 'Examen terminé',
    EXAM_LIST: 'Liste des examens',
    EXAM_LIST_ARCHIVED: 'Liste des examens archivés',
    EXAM_LIST_CURRENT: 'Liste des examens actifs',
    STUDENTS: 'Liste des étudiants',
    EXAM_PREVIEWING: "Prévisualisation d'examen",
    EXAM_EDITING_CONTENT: "Édition de l'examen",
    EXAM_EDITING_PARAMETERS: "Paramètres de l'examen",
    EXAM_EDITING_COLLECT: "Collecte des réponses de l'examen",
    EXAM_EDITING_RESULTS: "Résultats de l'examen",
    EXAM_EDITING_CONSULT: "Paramètres de consultation des copies de l'examen",
    EXAM_CHECKING: 'Correction de copie',
    TEACHER_HOME: 'Accueil professeur',
    GROUPS: 'Liste des groupes',
    EXAM_ARCHIVED: 'Erreur - examen archivé',
    ATTEMPT_NOT_CORRECTED: 'Erreur - copie non corrigée',
};

export { ROUTE_TITLES };
