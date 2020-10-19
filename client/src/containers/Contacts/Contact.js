import React from 'react';
import './Contacts.scss';

export default function Contact(){
    return (
        <div className='contact'>
            <span className='contact__img'>
                <img src='http://nevseoboi.com.ua/uploads/posts/2012-03/1331721250-530677-0053889_www.nevseoboi.com.ua.jpg' alt='user' />
            </span>
            <div className='contact__flex-wrapper'>
                <div className="contact__title">
                    <div className='contact__name'>Рак Чикибряк</div>
                    <div className='contact__time'>15:10</div>
                </div>
                <div className='contact__last-message'>
                    <span className='contact__last-message__who'>Рак:</span>
                    Здрасте. Я Рак Чикибряк
                </div>
            </div>
        </div>
    );
}