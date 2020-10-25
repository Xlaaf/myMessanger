import React, { useState, useRef } from 'react';
import './MsgInput.scss';

import isPC from './../../functions/isPC';


export default function MsgInput({ submitFunc, onBlur }) {
    // Check shift button is held
    const [isShift, setIsShift] = useState(false);

    // TextArea ref and State
    const msgInputRef = useRef();
    const [msgInput, setMsgInput] = useState({
        message: '',
        rows: 1
    });

    // Handler of message input
    const inputHandler = event => {
        const rowsCount = event.target.value.split('\n').length;
        setMsgInput({
            message: event.target.value,
            rows: rowsCount <= 10 ? rowsCount : 10
        });
    }

    // onSumbit handler
    const submitHandler = () => {
        msgInputRef.current.focus();
        const msgText = msgInput.message;
        if (!msgText) return;

        setMsgInput({
            message: '',
            rows: 1
        });

        submitFunc(msgText);
    }

    // keyDown Handler
    const keyDownHandler = event => {
        // If Shift button is held
        if (event.key === 'Shift') {
            setIsShift(true);
        }

        // Если нажали Enter, при этом не зажимая Shift, отправляем сообщение
        if (isPC() && event.key === 'Enter' && !isShift) {
            // PreventDefault чтобы в input не добавлялся \n и не увеличивалось кол-во строк в textarea
            event.preventDefault();
            submitHandler();
        }
    }


    return (
        <div className='message__input'>
            <textarea
                name='message'
                type='text'
                placeholder='Сообщение...'
                onKeyUp={ev => { if (ev.key === 'Shift') setIsShift(false) }}
                onKeyDown={keyDownHandler}
                onChange={inputHandler}
                value={msgInput.message}
                rows={msgInput.rows}
                ref={msgInputRef}
                onBlur={onBlur}
            />
            <button
                className='messages__btn-send'
                onClick={submitHandler}
            >
                <span className="material-icons">send</span>
            </button>
        </div>

    )
}