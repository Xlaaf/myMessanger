import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Contacts.scss';

import { useHttp } from './../../hooks/http.hook';
import Contact from './Contact';

export default function Contacts({ chooseContact }) {
    const { request } = useHttp();
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));
    const [tabStatus, setTabStatus] = useState(true);
    const [contacts, setContacts] = useState([]);


    // Получение списка переписок и пользователей с которыми они ведуться
    useEffect(() => {
        const getUsers = async () => {
            console.log('getUsers()');
            const res = await request(`/api/database/${jwtToken}/contacts`, 'GET');
            console.log(res);
            setContacts(res.contacts);
        }

        const getAllUsers = async () => {
            console.log('getAllUsers()');
            const res = await request(`/api/database/${jwtToken}/users`, 'GET');
            console.log(res);
            setContacts(res.users);
        }

        tabStatus
            ? getUsers()
            : getAllUsers();

    }, [request, jwtToken, tabStatus]);

    // Обработка табов
    const tabChange = (flag) => {
        setTabStatus(flag);
        setContacts([]);
    }


    return (
        <div className='contacts'>
            <div className={`contacts__tabes ${tabStatus ? 'active' : ''}`}>
                <span className={tabStatus ? 'active' : ''} onClick={()=>tabChange(true)}>Мои конакты</span>
                <span className={!tabStatus ? 'active' : ''} onClick={()=>tabChange(false)}>Все</span>
            </div>
            {
                tabStatus
                    ? contacts.map(c => <Contact
                        key={c.contact._id}
                        img={c.contact.photo}
                        name={c.contact.name}
                        time={new Date(c.lastMessage.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        lastMessage={c.lastMessage.text.split('').slice(0, 30).join('') + '...'}
                        onClick={() => chooseContact(c.contact._id)}
                    />)
                    : contacts.map(c => <Contact
                        key={c._id}
                        img={c.photo}
                        name={c.name}
                        onClick={() => chooseContact(c._id)}
                    />)
            }
        </div>
    );
}