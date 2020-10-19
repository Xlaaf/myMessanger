import React from 'react';

import Navbar from '../containers/Navbar/Navbar';
import FlexWrapper from './../hoc/FlexWrapper';
import Contacts from '../containers/Contacts/Contacts';
import Messages from './../containers/Messages/Messages';


export default function Home() {

    return (
        <div className='home'>
            <Navbar />
            <FlexWrapper>
                <Contacts />
                <Messages />
            </FlexWrapper>
        </div>
    )
}