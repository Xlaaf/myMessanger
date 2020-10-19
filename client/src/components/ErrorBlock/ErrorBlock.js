import React from 'react';
import './ErrorBlock.scss';

export default function ErrorBlock({errorMessage, isActive}) {
    return (
        <div className={`ErrorBlock ${isActive ? 'active' : ''}`}>
            <i className="fa fa-exclamation" aria-hidden="true" />
            {errorMessage}
        </div>
    )
}