import { USER_LOGIN, USER_LOGOUT } from '../types';

const initialState = {
    jwtToken: localStorage.getItem('jwtToken'),
    userId: localStorage.getItem('userId')
}

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                jwtToken: action.payload.token,
                userId: action.payload.userId
            }

        case USER_LOGOUT:
            return {
                ...state,
                jwtToken: null,
                userId: null
            }


        default: return state;
    }
}

