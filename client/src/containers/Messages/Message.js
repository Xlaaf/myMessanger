import React from 'react';
import './Messages.scss';

export default function Message({ own, img, text, time }) {

    return (
        <div className={`message ${own ? 'own' : ''}`}>
            <span className='message__img'>
                <img src={img} alt='user' />
            </span>
            <div className='message__content'>
                {
                    text.split('\n').map(text => (
                        <React.Fragment key={`${text}:${time}`}>
                            {text}
                            <br />
                        </React.Fragment>
                    ))
                }
                <span className='message__time'>{time}</span>
            </div>
        </div>
    )
}