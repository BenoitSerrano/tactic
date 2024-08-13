import { EXAM_ROUTE_KEYS } from '../../routes/routeKeys';

const editingExamLabelMapping: Record<(typeof EXAM_ROUTE_KEYS)[number], string> = {
    EXAM_EDITING_CONTENT: 'Contenu',
    EXAM_PARAMETERS: 'Paramètres',
    EXAM_ATTEMPT_COLLECT: 'Collecte des réponses',
    EXAM_RESULTS: 'Résultats',
    EXAM_CONSULT: 'Consultation des copies',
};

export { editingExamLabelMapping };
