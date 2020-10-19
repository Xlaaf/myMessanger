import React from 'react';
import Navbar from '../containers/Navbar/Navbar';
import ProfileSettings from './../containers/ProfileSettings/ProfileSettings';


export default function Profile() {
    return (
        <div className='profile'>
            <Navbar />
            <ProfileSettings />
        </div>
    );
}