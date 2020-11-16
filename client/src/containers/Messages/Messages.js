import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './Messages.scss';

import toggleBlocks from '../../functions/toggleMessages';
import setBlockHeight from '../../functions/setBlockHeight';
import { useHttp } from './../../hooks/http.hook';

import Message from './Message';
import MsgInput from '../../components/MsgInput/MsgInput';
import Loader from './../../components/Loader/Loader';


export default function Messages({ data, loading, socket }) {
    const { request } = useHttp();
    const { newMessage, status, sendMsg, initContact } = socket;
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));

    const [msgData, setMsgData] = useState(null);

    const mainBlockRef = useRef();
    const messagesBlockRef = useRef();


    // Установка высоты блока <Messages /> по высоте экрана
    useEffect(() => {
        setBlockHeight(mainBlockRef.current);
    });

    // Инициализация данных
    useEffect(() => {
        if (data) {
            setMsgData(data); // Перевод props.data в состояние msgData

            // Вызвать событие сокета на добавление в коллекцию "контактов" нового пользователя (back-end)
            initContact({ userId: data.secondUser._id });
        }

    }, [data, initContact]);

    // Обработка изменения состояния msgData (например: добавление нового сообщения)
    useEffect(() => {
        if (!msgData || loading) return;

        // прокрутка списка сообщений в самый низ
        messagesBlockRef.current.scrollTop = messagesBlockRef.current.scrollHeight;
    }, [msgData]);

    // Обработка получения нового сообщения
    useEffect(() => {
        if (!newMessage) return;
        if (!msgData) return;
        if (msgData.secondUser._id !== newMessage.userId) return;

        setMsgData(prev => ({
            ...prev,

            //  Добавление в массив сообщений нового сообщения
            messages: [newMessage, ...prev.messages]
        }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage]);

    // Создание блоков <Message /> по данным из "msgData"
    const createMessagesFromData = () => {
        const firstUserId = msgData.firstUser._id;

        return msgData.messages.map(msg => {
            const isOwn = msg.userId === firstUserId;

            return (
                <Message
                    key={msg._id}
                    own={isOwn}
                    img={isOwn ? msgData.firstUser.photo : msgData.secondUser.photo}
                    text={msg.text}
                    time={new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
            )
        });
    }

    // Создание объекта сообщения
    const createMessage = msgText => ({
        _id: Math.random(),
        time: Date.now(),
        text: msgText,
        userId: msgData.firstUser._id
    });

    // Отправка сообщения
    const sendMessage = async (messageText) => {
        const newMessage = createMessage(messageText);

        // Если массив сообщений есть (тоесть уже есть определнная история переписки между пользователями)
        if (msgData.messages) {
            setMsgData(prev => ({
                ...prev,

                // Добавление нового сообщения в начало массива сообщений
                messages: [newMessage, ...prev.messages]
            }));
        } else {
            setMsgData(prev => ({
                ...prev,

                // Создание массива сообщений и доавление в него первого сообщения
                messages: [newMessage]
            }));
        }

        // Отправка сообщения по сокету (сообщение: message, пользователь: userId)
        sendMsg({ message: newMessage, userId: msgData.secondUser._id });

        // Добавление нового сообщения в БД
        await request(`/api/chat/${jwtToken}/sendmessage`, 'POST', {
            message: messageText,
            secondUserId: msgData.secondUser._id
        });
    }


    return (
        <div className='messages' ref={mainBlockRef}>
            {
                loading ?
                    <Loader />
                    : msgData ?
                        <>
                            <div className='messages__title'>
                                <i className="fa fa-chevron-left" aria-hidden="true" onClick={toggleBlocks} />
                                <div className="messages__title__flex-wrapper">
                                    <span className='messages__title__name'>{msgData.secondUser.name}</span>
                                    <span className='messages__title__status'>{status[msgData.secondUser._id] ? 'Онлайн' : 'Оффлайн'}</span>
                                </div>
                            </div>

                            <div className='messages__body' ref={messagesBlockRef}>
                                {
                                    msgData.messages ? createMessagesFromData() : null
                                }
                            </div>

                            <MsgInput submitFunc={sendMessage} onBlur={() => setTimeout(() => setBlockHeight(mainBlockRef.current), 200)} />
                        </>
                        : <span className='empty'>Выберите кому хотите написать</span>
            }
        </div>
    );
}