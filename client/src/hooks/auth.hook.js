import { useDispatch } from 'react-redux';
import { userLogin, userLogout } from './../redux/actions';

export function useAuth() {
    const dispatch = useDispatch();
    const login = (jwtToken, userId) => {
        dispatch(userLogin(jwtToken, userId));
    }

    const logout = () => {
        dispatch(userLogout());
    }

    return { login, logout }
}