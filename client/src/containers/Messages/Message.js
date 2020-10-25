import React from 'react';
import './Messages.scss';

export default function Message({ own, img, text, time }) {


    return (
        <div className={`message ${own ? 'own' : ''}`}>
            <span className='message__img'>
                <img src={img} alt='user' />
            </span>
            <div className='message__content'>
                <pre>{text}</pre>
                <span className='message__time'>{time}</span>
            </div>
        </div>
    )
}