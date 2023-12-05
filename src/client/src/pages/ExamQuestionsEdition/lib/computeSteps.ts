const stepIds = ['SELECT_QUESTION_KIND', 'EDIT_QUESTION_POINTS', 'EDIT_QUESTION_CONTENT'] as const;
type stepIdType = (typeof stepIds)[number];

function computeSteps(): Record<stepIdType, { label: string }> {
    return {
        SELECT_QUESTION_KIND: { label: 'Type de question' },
        EDIT_QUESTION_CONTENT: { label: 'Contenu de la question' },
        EDIT_QUESTION_POINTS: { label: 'Points attribués' },
    };
}
export { computeSteps, stepIds };
