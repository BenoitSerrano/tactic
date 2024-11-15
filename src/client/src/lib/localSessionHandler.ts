import { userInfoType, userRoleType } from '../constants';
import { localStorage } from './localStorage';

const localSessionHandler = {
    setToken,
    logout,
    getToken,
    getIsAuthenticated,
    getUserRoles,
    setUserInfo,
};

function setToken(token: string) {
    localStorage.jwtTokenHandler.set(token);
}

function setUserInfo(userInfo: userInfoType) {
    localStorage.userInfoHandler.set(userInfo);
}

function getToken() {
    return localStorage.jwtTokenHandler.get();
}

function getIsAuthenticated() {
    return !!localStorage.jwtTokenHandler.get();
}

function getUserRoles(): userRoleType[] | undefined {
    const userInfo = localStorage.userInfoHandler.get();
    if (!userInfo) {
        return undefined;
    }
    return userInfo.roles;
}

function logout() {
    localStorage.userInfoHandler.remove();
    localStorage.jwtTokenHandler.remove();
}

export { localSessionHandler };
