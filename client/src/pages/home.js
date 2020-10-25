import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import toggleBlocks from '../functions/toggleMessages';
import { useHttp } from './../hooks/http.hook';
import Navbar from '../containers/Navbar/Navbar';
import FlexWrapper from './../hoc/FlexWrapper';
import Contacts from '../containers/Contacts/Contacts';
import Messages from './../containers/Messages/Messages';


export default function Home() {
    const { request } = useHttp();
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));

    // Данные о переписке (для отображения компонента <Messages />)
    const [messagesData, setMessagesData] = useState(null);

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
                <Contacts chooseContact={getMessages} />
                <Messages data={messagesData} />
            </FlexWrapper>
        </div>
    )
}