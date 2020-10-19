import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './../containers/Auth/Login/Login';
import Register from './../containers/Auth/Register/Register';


export default function Authentication() {
    return (
        <Switch>
            <Route path="/auth/login" render={() => <Login />} />
            <Route path="/auth/register" render={() => <Register />} />
        </Switch>
    )
}