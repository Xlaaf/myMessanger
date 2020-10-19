import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Authentication from '../pages/authentication';
import Home from '../pages/home';
import Profile from './../pages/profile';


function Routes({ history }) {
    const jwtToken = useSelector(state => state.auth.jwtToken);

    useEffect(() => {
        if (!jwtToken) {
            history.push('/auth/login');
        }
    }, [history, jwtToken]);

    if (!jwtToken) return (
        <Switch>
            <Route path='/auth' component={Authentication} />
            <Redirect to='/' />
        </Switch>
    );

    return (
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/profile' component={Profile} />

            <Redirect to='/' />
        </Switch>
    )
}

export default withRouter(Routes);