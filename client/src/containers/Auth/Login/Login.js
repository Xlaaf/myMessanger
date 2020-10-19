import React, { useRef } from 'react';
import { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../style.scss';

import ErrorBlock from '../../../components/ErrorBlock/ErrorBlock';
import { useHttp } from './../../../hooks/http.hook';
import { useAuth } from './../../../hooks/auth.hook';
import { useValidation } from './../../../hooks/validation.hook';


function Login(props) {
    const { request } = useHttp();
    const { isEmail, passwordLength } = useValidation();
    const { login } = useAuth();

    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const [serverMsg, setServerMsg] = useState('');
    const [showServerMsg, setShowServerMsg] = useState(false);


    const emailErrorMsgRef = useRef();
    const passErrorMsgRef = useRef();


    const toHome = () => {
        props.history.push('/');
    }

    const inputHandler = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    const loginHandler = async event => {
        event.preventDefault();
        setShowServerMsg(false);

        try {
            const passValid = passwordLength(data.password);
            const emailValid = isEmail(data.email);

            !passValid ? passErrorMsgRef.current.classList.add('active')
                : passErrorMsgRef.current.classList.remove('active');

            !emailValid ? emailErrorMsgRef.current.classList.add('active')
                : emailErrorMsgRef.current.classList.remove('active');

            if (passValid && emailValid) {
                const response = await request('/api/auth/login', 'POST', { ...data });
                login(response.token, response.userId);
                toHome();
            }


        } catch (e) {
            console.error("I.Error: ", e);
            setServerMsg(e.message);
            setShowServerMsg(true);
        }

    }

    return (
        <>
            <div className="AuthForm">
                <h4>Вход</h4>
                <form action='#' method="POST">
                    <div className="AuthForm__input-cover">
                        <label htmlFor="email"><i className="fa fa-user-o" aria-hidden="true" /></label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Пользователь"
                            onChange={inputHandler}
                            value={data.email}
                            required
                        />
                        <span className="errorMsg" ref={emailErrorMsgRef}>
                            Введите корректный email
                        <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <div className="AuthForm__input-cover">
                        <label htmlFor="email"><i className="fa fa-pencil" aria-hidden="true" /></label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            onChange={inputHandler}
                            value={data.password}
                            required
                        />
                        <span className="errorMsg" ref={passErrorMsgRef}>
                            Введите корректный email
                        <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <button type="submit" onClick={loginHandler}>Вход</button>
                    <Link to="/auth/register">Нет аккаунта?</Link>
                </form>
            </div>
            <ErrorBlock errorMessage={serverMsg} isActive={showServerMsg} />
        </>
    )
}

export default withRouter(Login);