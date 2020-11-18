import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import './ProfileSettings.scss';

import { useHttp } from './../../hooks/http.hook';
import Loader from '../../components/Loader/Loader';


export default function ProfileSettings(props) {
    const { request } = useHttp();
    const [userInfo, setUserInfo] = useState({
        jwtToken: useSelector(state => state.auth.jwtToken),
        old_photo: '',
        photo: '',
        name: ''
    });


    // GET запрос на получение данных пользователя (фото, имя)
    useEffect(() => {
        const getUserInfo = async () => {
            const res = await request(`/api/database/${userInfo.jwtToken}/userInfo`, 'GET');
            if(res.jwtError) return;

            setUserInfo(prev => ({
                ...prev,
                old_photo: res.photo,
                photo: res.photo,
                name: res.name
            }));
        }

        getUserInfo();
    }, [request, userInfo.jwtToken]);

    // Обработка input-ов
    const inputHandler = (ev) => {
        setUserInfo({
            ...userInfo,
            [ev.target.name]: ev.target.value
        });
    }

    // POST запрос на изменение данных пользователя (фото, имя)
    const postUserInfo = async () => {
        await request(`/api/database/${userInfo.jwtToken}/userInfo`, 'POST', {
            name: userInfo.name,
            photo: userInfo.photo
        });

        window.location.reload();
    }


    return (
        <div className='profile-settings'>
            <div className='profile-settings__photo'>
                <span>
                    {userInfo.photo ? <img src={userInfo.old_photo} alt='user' /> : <Loader />}
                </span>
                <label htmlFor='photo'>Фото URL</label>
                <input id='photo' name='photo' type='text' placeholder="Фото URL" value={userInfo.photo} onChange={inputHandler} />
            </div>
            <label htmlFor='name'>Имя</label>
            <input id='name' name='name' type='string' placeholder="Имя" value={userInfo.name} onChange={inputHandler} />
            <button onClick={postUserInfo}>Сохранить</button>

        </div>
    );
}