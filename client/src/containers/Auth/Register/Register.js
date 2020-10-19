import React from 'react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../style.scss';

import ErrorBlock from './../../../components/ErrorBlock/ErrorBlock';
import { useHttp } from './../../../hooks/http.hook';
import { useValidation } from './../../../hooks/validation.hook';


export default function Register() {
    const { loading, request } = useHttp();
    const validate = useValidation();

    const [data, setData] = useState({
        email: '',
        name: '',
        password: '',
        confirm: ''
    });

    const [serverMsg, setServerMsg] = useState('');
    const [showServerMsg, setShowServerMsg] = useState(false);


    const confirmErrorMsgRef = useRef();
    const emailErrorMsgRef = useRef();
    const passErrorMsgRef = useRef();
    const nameErrorMsgRef = useRef();

    const clearForm = () => {
        setData({
            email: '',
            name: '',
            password: '',
            confirm: ''
        });
    }

    const inputHandler = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    const registerHandler = async event => {
        event.preventDefault();

        try {
            setShowServerMsg(false);

            const emailValid = validate.isEmail(data.email);
            const passLenValid = validate.passwordLength(data.password);
            const confirmValid = validate.passwordConfirm(data.password, data.confirm);
            const nameValid = data.name.length > 2;

            !emailValid ? emailErrorMsgRef.current.classList.add('active')
                : emailErrorMsgRef.current.classList.remove('active');

            !passLenValid ? passErrorMsgRef.current.classList.add('active')
                : passErrorMsgRef.current.classList.remove('active');

            !confirmValid ? confirmErrorMsgRef.current.classList.add('active')
                : confirmErrorMsgRef.current.classList.remove('active');

            !nameValid ? nameErrorMsgRef.current.classList.add('active')
                : nameErrorMsgRef.current.classList.remove('active');

            if (emailValid && passLenValid && confirmValid && nameValid) {
                const resData = await request('/api/auth/register', 'POST', { ...data });
                clearForm();
                setServerMsg(resData.message);
                setShowServerMsg(true);
            }

        } catch (e) {
            console.error(e);
            setServerMsg(e.message);
            setShowServerMsg(true);
        }
    }


    return (
        <>
            <div className="AuthForm">
                <h4>Регистрация</h4>
                <form action='/api/auth/register' method='POST'>
                    <div className="AuthForm__input-cover">
                        <label htmlFor="email"><i className="fa fa-user-o" aria-hidden="true" /></label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={inputHandler}
                            value={data.email}
                            disabled={loading}
                            required
                        />
                        <span className="errorMsg" ref={emailErrorMsgRef}>
                            Введите корректный email
                            <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <div className="AuthForm__input-cover">
                        <label htmlFor="name"><i className="fa fa-user-o" aria-hidden="true" /></label>
                        <input
                            id="name"
                            name="name"
                            type="string"
                            placeholder="Имя"
                            onChange={inputHandler}
                            value={data.name}
                            disabled={loading}
                            required
                        />
                        <span className="errorMsg" ref={nameErrorMsgRef}>
                            Введите имя
                            <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <div className="AuthForm__input-cover">
                        <label htmlFor="password"><i className="fa fa-pencil" aria-hidden="true" /></label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Пароль"
                            onChange={inputHandler}
                            value={data.password}
                            disabled={loading}
                            required
                        />
                        <span className="errorMsg" ref={passErrorMsgRef}>
                            Минимальная длина пароля 6 символов
                            <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <div className="AuthForm__input-cover">
                        <label htmlFor="confirm"><i className="fa fa-star-o" aria-hidden="true" /></label>
                        <input
                            id="confirm"
                            name="confirm"
                            type="password"
                            placeholder="Подтвердите пароль"
                            onChange={inputHandler}
                            value={data.confirm}
                            disabled={loading}
                            required
                        />
                        <span className="errorMsg" ref={confirmErrorMsgRef}>
                            Пароли не совпадают
                            <i className="fa fa-exclamation-circle" aria-hidden="true" />
                        </span>
                    </div>

                    <button type='submit' onClick={registerHandler}>Подтвердить</button>
                    <Link to="/auth/login">Уже есть аккаунт?</Link>
                </form>
            </div>
            <ErrorBlock errorMessage={serverMsg} isActive={showServerMsg} />
        </>
    )
}