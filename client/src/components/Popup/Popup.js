import React from 'react';
import './Popup.scss';

export default function Popup({ children, isVisible }) {

    return (
        <div className={`popup ${isVisible ? 'visible' : ''}`}>
            {children}
        </div>
    );
}