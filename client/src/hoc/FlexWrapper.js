import React from 'react';
import './FlexWrapper.scss';

export default function FlexWrapper({ children }) {
    return (
        <div className='flex-wrapper'>
            {children}
        </div>
    );
}