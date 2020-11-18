import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Contacts.scss';

import { useHttp } from './../../hooks/http.hook';
import Contact from './Contact';

export default function Contacts({ chooseContact, socket }) {
    const { request } = useHttp();
    const { status, initContact, newMessage } = socket;
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));
    const [tabStatus, setTabStatus] = useState(true);
    const [contacts, setContacts] = useState([]);


    // Получение списка переписок и пользователей с которыми они ведуться
    useEffect(() => {
        const getUsers = async () => {
            console.log('getUsers()');
            const res = await request(`/api/database/${jwtToken}/contacts`, 'GET');
            if(res.jwtError) return;

            // Добавление пользователя в список "контактов" сокета (для рассылки изменений данных пользователя)
            res.contacts.forEach(c => initContact({ userId: c.contact._id }));
            setContacts(res.contacts);
        }

        const getAllUsers = async () => {
            console.log('getAllUsers()');
            const res = await request(`/api/database/${jwtToken}/users`, 'GET');
            if(res.jwtError) return;

            const users = res.users;

            setContacts(users);
        }

        tabStatus
            ? getUsers()
            : getAllUsers();

    }, [request, jwtToken, tabStatus, initContact]);

    // Обработка переключения табов
    const tabChange = (flag) => {
        setTabStatus(flag);
        setContacts([]);
    }

    // Форматирование текста последнего сообщения (если текст слишком длинный, обрезать и добавить "...")
    const lastMessageFormat = (message) => {
        return message.length < 30
            ? message
            : message.split('').slice(0, 30).join('') + '...';
    }

    // Обработка получения нового сообщения
    const setNewMessage = (userId) => {
        if (!newMessage) return null;
        if (userId !== newMessage.userId) return null;
        return lastMessageFormat(newMessage.text);
    }


    return (
        <div className='contacts'>
            <div className={`contacts__tabes ${tabStatus ? 'active' : ''}`}>
                <span className={tabStatus ? 'active' : ''} onClick={() => tabChange(true)}>Мои конакты</span>
                <span className={!tabStatus ? 'active' : ''} onClick={() => tabChange(false)}>Все</span>
            </div>
            {
                tabStatus
                    ? contacts.map(c => <Contact
                        key={c.contact._id}
                        img={c.contact.photo}
                        name={c.contact.name}
                        time={new Date(c.lastMessage.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        lastMessage={lastMessageFormat(c.lastMessage.text)}
                        newMessage={setNewMessage(c.contact._id)}
                        isOnline={status[c.contact._id]}

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