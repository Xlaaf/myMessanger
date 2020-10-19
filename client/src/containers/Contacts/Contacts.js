import React from 'react';
import './Contacts.scss';

import Contact from './Contact';

export default function Contacts() {
    return (
        <div className='contacts'>
            <Contact />
            <Contact />
            <Contact />
        </div>
    );
}