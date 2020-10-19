import React, { useEffect, useRef, useState } from 'react';
import './Messages.scss';

import Message from './Message';


export default function Messages() {
    const [msgInput, setMsgInput] = useState({
        message: '',
        rows: 1
    });

    const mainBlockRef = useRef();


    // Compute block's height (for mobile-layout)
    useEffect(() => {
        const contactsElem = document.querySelector('.contacts');
        const contactsDisplayStyle = window.getComputedStyle(contactsElem).display;
        if (contactsDisplayStyle === 'none') {
            const displayHeight = window.innerHeight;
            const navbarHeight = document.querySelector('.navbar').getBoundingClientRect().height;
            mainBlockRef.current.style.height = displayHeight - navbarHeight + 'px';
        }
    });

    // Handler of message input
    const inputHandler = ({ target }) => {
        const rowsCount = target.value.split('\n').length;
        setMsgInput({
            message: target.value,
            rows: rowsCount <= 10 ? rowsCount : 10
        });
    }


    return (
        <div className='messages' ref={mainBlockRef}>
            <div className='messages__title'>
                <span className='messages__title__name'>Рак Чикибряк</span>
                <span className='messages__title__status'>Онлайн</span>
            </div>

            <div className='messages__body'>
                <Message />
                <Message own={true} />
                <Message />
                <Message own={true} />
                <Message own={true} />
                <Message own={true} />
                <Message />
                <Message />
                <Message />
            </div>

            <div className='messages__input'>
                <textarea
                    name='message'
                    type='text'
                    placeholder='Сообщение...'
                    onChange={inputHandler}
                    value={msgInput.message}
                    rows={msgInput.rows} />
                <button className='messages__btn-send'><span className="material-icons">send</span></button>
            </div>
            {/* <span className='empty'>Выберите кому хотите написать</span> */}
        </div>
    );
}