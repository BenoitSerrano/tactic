import { focusChangeEventType } from '../cheatingHandler';

const KEY = 'TDL_FOCUS_CHANGES_';

const focusChanges = { get, set, remove };

function get(attemptId: string): focusChangeEventType[] {
    const item = localStorage.getItem(KEY + attemptId);

    return item ? JSON.parse(item) : [];
}

function set(attemptId: string, value: focusChangeEventType[]) {
    localStorage.setItem(KEY + attemptId, JSON.stringify(value));
}
function remove(attemptId: string) {
    localStorage.removeItem(KEY + attemptId);
}

export { focusChanges };
