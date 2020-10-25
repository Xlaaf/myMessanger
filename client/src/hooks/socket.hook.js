import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import { useHttp } from './http.hook';

export default function useSocket() {
    const { request } = useHttp();
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));
    const [userId] = useState(useSelector(state => state.auth.userId));
    const [socket, setSocket] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [status, setStatus] = useState({});


    // Определение сокета
    useEffect(() => {
        setSocket(io(window.location.hostname + ':5000'));
    }, [jwtToken, request]);

    // Добавление событий
    useEffect(() => {
        if (!socket) return;

        // Событие на получение нового сообщения
        socket.on('newMessage', (msg) => {
            setNewMessage(msg);
        });

        // Событие на обновление онлайн статуса
        socket.on('update-status', (data) => {
            setStatus(prev => ({
                ...prev,

                // Ключ - userId пользователя
                // Значение - статус онлайн пользователя
                [data.userId]: data.isOnline
            }));
        });

    }, [socket, userId]);


    // Вызов события "connect"
    const initialUser = useCallback((data) => {
        if (!socket) return;
        socket.emit('initialUser', data);

    }, [socket]);

    // Вызов события "initContact"
    const initContact = useCallback((data) => {
        if (!socket) return;
        socket.emit('initContact', data);

        // Получение статуса онлайн конкретного пользователя по userId
        const getStatus = async () => {
            const res = await request(`/api/database/${jwtToken}/${data.userId}/status`, 'GET');
            setStatus(prev => ({
                ...prev,
                [data.userId]: res.isOnline
            }));
        }
        getStatus();
        
    }, [socket, jwtToken, request]);

    // Вызов события "message"
    const sendMsg = useCallback((msgData) => {
        if (!socket) return;
        socket.emit('message', msgData);
    }, [socket]);


    return { newMessage, status, sendMsg, initialUser, initContact };
}