const attemptActionEncoder = { decode, encode };

const attemptActions = ['take', 'consult'] as const;
type attemptActionType = (typeof attemptActions)[number];

function encode(action: attemptActionType) {
    return stringToBase64(action);
}

function decode(encodedAction: string): attemptActionType {
    const decodedAction = base64ToString(encodedAction);
    if (attemptActions.includes(decodedAction as any)) {
        return decodedAction as attemptActionType;
    }
    return 'take';
}

function base64ToString(str: string): string {
    return atob(str);
}

function stringToBase64(str: string) {
    return btoa(str);
}
export { attemptActionEncoder };
export type { attemptActionType };
