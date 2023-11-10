const possibleActions = ['take', 'consult'];

type actionType = 'take' | 'consult';

function extractActionFromSearchParams(searchParams: URLSearchParams): actionType {
    const actionSearchParams = searchParams.get('action');
    if (!actionSearchParams) {
        return 'take';
    }
    if (possibleActions.includes(actionSearchParams)) {
        return actionSearchParams as actionType;
    }
    return 'take';
}

export { extractActionFromSearchParams };
