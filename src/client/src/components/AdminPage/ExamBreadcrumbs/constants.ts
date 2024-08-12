import { EXAM_ROUTE_KEYS } from '../../../routes/routeKeys';

const editingExamLabelMapping: Record<(typeof EXAM_ROUTE_KEYS)[number], string> = {
    EXAM_EDITING_CONTENT: 'Examen',
    EXAM_EDITING_PARAMETERS: 'Paramètres',
    EXAM_EDITING_COLLECT: 'Collecte des réponses',
    EXAM_EDITING_RESULTS: 'Résultats',
    EXAM_EDITING_CONSULT: 'Consultation des copies',
};

export { editingExamLabelMapping };
