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
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        setSocket(io(window.location.hostname + ':5000'));
    }, [jwtToken, request]);

    // on socket change
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (msg) => {
            setNewMessage(msg);
        });

        socket.on('userStatus', (data) => {
            if(data.userId === userId) return;
            setIsOnline(data.isOnline);
        });

    }, [socket, userId]);


    const joinRoom = useCallback((data) => {
        socket.emit('join', data);

        const setStatus = async () => {
            const res = await request(`/api/database/${jwtToken}/${data.secondUserId}/status`, 'GET');
            setIsOnline(res.isOnline);
        }

        setStatus();

    }, [socket, jwtToken, request]);

    const sendMsg = useCallback((msgData) => {
        socket.emit('message', msgData);
    }, [socket]);



    return { newMessage, isOnline, sendMsg, joinRoom };
}