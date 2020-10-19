import React from 'react';
import './Messages.scss';

export default function Message({ own }) {

    
    return (
        <div className={`message ${own ? 'own' : ''}`}>
            <span className='message__img'>
                <img src='https://pbs.twimg.com/profile_images/913861131005022209/iaBdZZn1.jpg' alt='user' />
            </span>
            <div className='message__content'>
            Здравствуйте. Меня зовут Рак Чикибряк. Я представитель компании орифлейм...
                <span className='message__time'>15:43</span>
            </div>
        </div>
    )
}