import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './Messages.scss';

import toggleBlocks from '../../functions/toggleMessages';
import setBlockHeight from '../../functions/setBlockHeight';
import { useHttp } from './../../hooks/http.hook';
import useSocket from './../../hooks/socket.hook';
import Message from './Message';
import MsgInput from '../../components/MsgInput/MsgInput';


export default function Messages({ data }) {
    const { request } = useHttp();
    const { newMessage, isOnline, sendMsg, joinRoom } = useSocket();
    const [jwtToken] = useState(useSelector(state => state.auth.jwtToken));

    const [msgData, setMsgData] = useState(null);

    const mainBlockRef = useRef();
    const messagesBlockRef = useRef();


    // Compute block's height (for mobile-layout)
    useEffect(() => {
        setBlockHeight(mainBlockRef.current);
    });


    // "props.data" to state "msgData"
    useEffect(() => {
        if (data) {
            setMsgData(data);
            joinRoom({
                roomId: data.roomId,
                userId: data.firstUser._id,
                secondUserId: data.secondUser._id
            });
        }

    }, [data, joinRoom]);


    // on msgData change
    useEffect(() => {
        if (!msgData) return;

        // прокрутка списка сообщений в самый низ
        messagesBlockRef.current.scrollTop = messagesBlockRef.current.scrollHeight;
    }, [msgData]);


    // On new message
    useEffect(() => {
        if (!newMessage) return;

        setMsgData(prev => ({
            ...prev,
            messages: [newMessage, ...prev.messages]
        }));

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

        if (msgData.messages) {
            setMsgData(prev => ({
                ...prev,
                messages: [newMessage, ...prev.messages]
            }));
        } else {
            setMsgData(prev => ({
                ...prev,
                messages: [newMessage]
            }));
        }

        sendMsg(newMessage);

        await request(`/api/chat/${jwtToken}/sendmessage`, 'POST', {
            message: messageText,
            secondUserId: msgData.secondUser._id
        });
    }


    return (
        <div className='messages' ref={mainBlockRef}>
            {
                msgData ?
                    <>
                        <div className='messages__title'>
                            <i className="fa fa-chevron-left" aria-hidden="true" onClick={toggleBlocks} />
                            <div className="messages__title__flex-wrapper">
                                <span className='messages__title__name'>{data.secondUser.name}</span>
                                <span className='messages__title__status'>{isOnline ? 'Онлайн' : 'Оффлайн'}</span>
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