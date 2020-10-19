import { USER_LOGIN, USER_LOGOUT } from './types';

export function userLogin(token, userId) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userId', userId);
    return {
        type: USER_LOGIN,
        payload: { token, userId }
    }
}

export function userLogout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    return { type: USER_LOGOUT };
}