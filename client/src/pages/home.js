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

    const [messagesData, setMessagesData] = useState(null);

    const getMessages = async (scndUserId) => {
        toggleBlocks();

        const res = await request(`/api/database/${jwtToken}/messages/${scndUserId}`, 'GET');
        console.log('getMessages', res);
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