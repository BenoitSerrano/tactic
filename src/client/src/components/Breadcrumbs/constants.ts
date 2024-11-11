import { EXAM_ROUTE_KEYS } from '../../routes/routeKeys';

const editingExamLabelMapping: Record<(typeof EXAM_ROUTE_KEYS)[number], string> = {
    EXAM_EDITING_CONTENT: "Éditer l'examen",
    EXAM_PARAMETERS: "Paramètres de l'examen",
    EXAM_ATTEMPT_COLLECT: "Lien de l'examen",
    EXAM_RESULTS: 'Résultats',
    EXAM_CONSULT: 'Accès aux copies corrigées',
};

export { editingExamLabelMapping };
