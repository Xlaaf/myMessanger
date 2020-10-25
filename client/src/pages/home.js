import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import toggleBlocks from '../functions/toggleMessages';
import { useHttp } from './../hooks/http.hook';
import Navbar from '../containers/Navbar/Navbar';
import FlexWrapper from './../hoc/FlexWrapper';
import Contacts from '../containers/Contacts/Contacts';
import Messages from './../containers/Messages/Messages';
import useSocket from './../hooks/socket.hook';


export default function Home() {
    const { request } = useHttp();
    const socket = useSocket();    
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));
    const [userId] = useState(useSelector(state => state.auth.userId));

    // Данные о переписке (для отображения компонента <Messages />)
    const [messagesData, setMessagesData] = useState(null);

    // Инициализция пользователя по сокету
    useEffect(() => {
        if(!socket) return;
        socket.initialUser({ userId });
    }, [socket, userId]);

    // Получить данные о переписке
    const getMessages = async (scndUserId) => {
        // Переключить компонент <Contacs /> на <Messages /> в мобильной верстке
        toggleBlocks();

        const res = await request(`/api/database/${jwtToken}/messages/${scndUserId}`, 'GET');
        setMessagesData(res);
    }


    return (
        <div className='home'>
            <Navbar />
            <FlexWrapper>
                <Contacts chooseContact={getMessages} socket={socket} />
                <Messages data={messagesData} socket={socket} />
            </FlexWrapper>
        </div>
    )
}