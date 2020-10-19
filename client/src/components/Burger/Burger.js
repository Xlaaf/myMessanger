import React, {useRef} from 'react';
import './Burger.scss';

export default function Burger({ action }) {
    const burgerRef = useRef();

    const onClickHandler = () => {
        burgerRef.current.classList.toggle('active');
        action();
    }

    return (
        <span className="burger" ref={burgerRef} onClick={onClickHandler}>
            <span />
        </span>
    )
}