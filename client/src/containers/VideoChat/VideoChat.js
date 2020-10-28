import React, { useState, useEffect, useRef } from 'react';
import './VideoChat.scss';

export default function VideoChat() {
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef();
    const localVideoRef2 = useRef();

    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        console.log('videoChat : useEffect');

        const videoChatBlock = document.querySelector('.video-chat');
        const displayHeight = window.innerHeight;
        videoChatBlock.style.height = displayHeight + 'px';


        const runStream = async () => {
            let stream = null;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
                localVideoRef.current.srcObject = stream;
                localVideoRef2.current.srcObject = stream;
                setLocalStream(stream);

            } catch (e) {
                console.log('Error: ', e);
                setErrorText(e.message);
            }
        }

        runStream();

    }, [localVideoRef]);


    return (
        <div className='video-chat'>
            <div className='video-chat__container'>
                <div className='video-chat__local'>
                    {errorText || <video ref={localVideoRef} id='local' autoPlay />}
                </div>
                <div className='video-chat__remote'>
                    {errorText || <video ref={localVideoRef2} id='remote' autoPlay />}
                </div>
            </div>
        </div>
    )
}