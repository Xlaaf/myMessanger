import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.scss';

import { useAuth } from './../../hooks/auth.hook';
import { useHttp } from './../../hooks/http.hook';

import Popup from '../../components/Popup/Popup';
import Burger from '../../components/Burger/Burger';

export default function Navbar() {
    const { logout } = useAuth();
    const { request } = useHttp();
    const [userPopup, setUserPopup] = useState(false);

    const [userInfo, setUserInfo] = useState({
        userId: useSelector(state => state.auth.userId),
        jwtToken: useSelector(state => state.auth.jwtToken),
        name: '',
        photo: ''
    });

    // Показать/скрыть меню пользователя (на экране смартфона)
    const userMenuRef = useRef();
    const toggleUserMenu = () => {
        userMenuRef.current.classList.toggle('visible');
    }


    // GET запрос на Имя и Аватарку пользователя
    useEffect(() => {
        const getUserInfo = async () => {
            const response = await request(`/api/database/${userInfo.jwtToken}/userInfo`, 'GET');

            setUserInfo(prev => ({
                ...prev,
                name: response.name,
                photo: response.photo
            }));
        }

        getUserInfo();
    }, [userInfo.userId, request, userInfo.jwtToken]);


    // Скрыть Popup по клику вне элемента
    useEffect(() => {
        function hidePopup() {
            if (userPopup) {
                setUserPopup(false);
            }
        }

        window.document.addEventListener('click', hidePopup);
        return () => {
            window.document.removeEventListener('click', hidePopup);
        }
    });


    // Элемент меню пользователя
    const userMenu = (
        <ul>
            <li>
                <i className="fa fa-user" aria-hidden="true" />
                <Link to='/profile'>Профиль</Link>
            </li>

            <li onClick={logout}>
                <i className="fa fa-sign-out" aria-hidden="true" />
                Выйти
            </li>
        </ul>
    );

    return (
        <div className='navbar'>
            {/* Бургер. Показывается только на экране смартфона */}
            <Burger action={toggleUserMenu} />

            <div className='navbar__logo'>
                <Link to='/'>My Messanger</Link>
            </div>

            {/* Широкоэкранный navbar */}
            <div className='navbar__user'>
                <div className='navbar__user__wrapper' onClick={() => setUserPopup(!userPopup)}>
                    <span className='navbar__user__wrapper__img'>
                        {userInfo.photo && <img alt="user" src={userInfo.photo} />}
                    </span>
                    <span>{userInfo.name}</span>
                </div>
                <Popup isVisible={userPopup}>
                    {userMenu}
                </Popup>
            </div>

            {/* Мобильный navbar */}
            <div className="navbar__user__under-burger" ref={userMenuRef}>
                <div className='navbar__user__under-burger__wrapper'>
                    <span className='navbar__user__under-burger__wrapper__img'>
                        {userInfo.photo && <img alt="user" src={userInfo.photo} />}
                    </span>
                    <span>{userInfo.name}</span>
                </div>
                {userMenu}
            </div>

        </div>
    )
}