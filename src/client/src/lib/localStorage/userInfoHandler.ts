import { userInfoType } from '../../constants';

const KEY = 'TACTIC_USER_INFO';

function get() {
    const value = localStorage.getItem(KEY);
    if (!value) {
        return undefined;
    }
    return JSON.parse(value) as userInfoType;
}

function set(value: userInfoType) {
    localStorage.setItem(KEY, JSON.stringify(value));
}

function setRemainingPapers(value: number) {
    const currentUserInfo = localStorage.getItem(KEY);
    if (!currentUserInfo) {
        return undefined;
    }
    const parsedCurrentUserInfo = JSON.parse(currentUserInfo) as userInfoType;
    parsedCurrentUserInfo.remainingPapers = value;
    set(parsedCurrentUserInfo);
}

function remove() {
    localStorage.removeItem(KEY);
}

const userInfoHandler = { get, set, setRemainingPapers, remove };

export { userInfoHandler };
