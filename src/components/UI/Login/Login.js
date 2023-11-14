import React, { useState } from "react";
import cl from "./Login.module.css"
import { getUserAddreses, getUserInfo } from "../../../web3/contractController";


const Login = () => {

    const [userAddress, setUserAddress] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [passwordNotShowed, setPasswordNotShowed] = useState('block');
    const [passwordShowed, setPasswordShowed] = useState('none');

    const buttonHandler = async () => {
        let flag = false;
        const addresses = await getUserAddreses();
        if (userAddress.length != 42 || userPassword < 5 || userEmail.length < 5) {
            alert("Некорректные данные");
            return
        }

        for(let i = 0; i < addresses.length; i++) {
            if(addresses[i] == userAddress) {
                flag = true;
            }
        }

        if(flag == false) {
            alert("Такого аккаунта нет")
            return
        }
        const userInfo = await getUserInfo(userAddress, userPassword)
        if(userInfo.email != userEmail || !userInfo.password) {
            alert("Неверный email или пароль")
            return
        }
        
        sessionStorage.setItem('login', true);
        sessionStorage.setItem('address', userAddress);
        sessionStorage.setItem('role', userInfo.role);

        switch(userInfo.role){
            case 1: 
                window.location.href = 'http://localhost:3000/buyer';
                break;
            case 2:
                window.location.href = 'http://localhost:3000/seller';
                break;
            case 3: 
                window.location.href = 'http://localhost:3000/admin';
                break;
        }
     }

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
                        <input className={cl.text_field__input} type="text" name="email" id="email" placeholder="Email"
                        onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="address">Адрес</h1>
                        <input className={cl.text_field__input} type="text" name="address" id="address" placeholder="Address"
                        onChange={(e) => setUserAddress(e.target.value)}
                        />
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="password">Пароль</h1>
                        <input className={cl.text_field__input} type="text" name="password" id="password" placeholder="Password"
                        onChange={(e) => setUserPassword(e.target.value)}
                        />
                    </div>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.button_handler}>
                    <button className={cl.btn_login}
                    onClick={buttonHandler}
                    >Войти в аккаунт</button>
                    <a className={cl.registration}
                    onClick={() => window.location.href = "http://localhost:3000/registration"}
                    >Зарегестрироваться</a>
                </div>
            </section>
        </div>
    );
}

export default Login;