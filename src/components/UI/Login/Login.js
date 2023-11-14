import React, { useState } from "react";
import cl from "./Login.module.css"


const Login = () => {

    return (
        <div className={cl.root}>
            <section className={cl.main_window}>
                <header className={cl.header}>
                    <h1 className={cl.login}>Login</h1>
                </header>
                <hr className={cl.hr}/>
                <div className={cl.main}>
                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="email">Емаил</h1>
                        <input className={cl.text_field__input} type="text" name="email" id="email" placeholder="Email"/>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="address">Адрес</h1>
                        <input className={cl.text_field__input} type="text" name="address" id="address" placeholder="Address"/>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="password">Пароль</h1>
                        <input className={cl.text_field__input} type="text" name="password" id="password" placeholder="Password"/>
                    </div>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.button_handler}>
                    <button className={cl.btn_login}>Войти в аккаунт</button>
                    <a className={cl.registration}
                    onClick={() => window.location.href = "http://localhost:3000"}
                    >Зарегестрироваться</a>
                </div>
            </section>
        </div>
    );
}

export default Login;