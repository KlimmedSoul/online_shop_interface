import React, { useState } from "react";
import cl from "./Registration.module.css"
import { registration, getUserAddreses } from "../../../web3/contractController";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Registration = () => {

    const [userPassword, setUserPassword] = useState('');
    const [userSecondPassword, setUserSecondPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAddress, setUserAddress] = useState('');

    const [firstPasswordNotShowed, setFirstPasswordNotShowed] = useState('block');
    const [firstPasswordShowed, setFirstPasswordShowed] = useState('none');
    const [secondPasswordNotShowed, setSecondPasswordNotShowed] = useState('block');
    const [secondPasswordShowed, setSecondPasswordShowed] = useState('none');

    const buttonHander = async () => {
        const userAddresses = await getUserAddreses();
        if(userAddress.length != 42 || userPassword.length < 5 || userEmail.length < 5) {
            alert("Некорректные данные")
            return
        } 

        if(userPassword != userSecondPassword) {
            alert("Пароли не совпадают")
            return
        }
        
        for(let i = 0; i < userAddresses.length; i++) {
            if(userAddresses[i] == userAddress) {
                alert("Такой пользователь уже зарегестрирован")
                return
            }
        }
        await registration(userEmail, userPassword, userAddress);

        window.location.href = "http://localhost:3000/login";
    }


    return (
        <div className={cl.root}>
            <section className={cl.main_window}>
                <header className={cl.header}>
                    <h1 className={cl.login}>Registration</h1>
                </header>
                <hr className={cl.hr}/>
                <div className={cl.main}>
                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="email">Емаил</h1>
                        <input className={cl.text_field__input} type="text" name="email" id="email" placeholder="Email"
                        onChange={(e) => setUserEmail(e.target.value)}/>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="address">Адрес</h1>
                        <input className={cl.text_field__input} type="text" name="address" id="address" placeholder="Address"
                        onChange={(e) => setUserAddress(e.target.value)}/>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="password">Пароль</h1>
                        <div className={cl.input_handler}>
                            <input className={cl.text_field__input} type={firstPasswordShowed == 'none' ? "password" : "text"} name="password" id="password" placeholder="Password"
                            onChange={(e) => setUserPassword(e.target.value)}/>
                            <Visibility className={cl.icon}
                            onClick={() => {
                                setFirstPasswordNotShowed('none')
                                setFirstPasswordShowed('block')
                            }}
                            style={{display: firstPasswordNotShowed}}/>
                            <VisibilityOff className={cl.icon}
                            onClick={() => {
                                setFirstPasswordShowed('none')
                                setFirstPasswordNotShowed('block')
                            }}
                            style={{display: firstPasswordShowed}}/>
                        </div>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="password">Повторите пароль</h1>
                        <div className={cl.input_handler}>
                            <input className={cl.text_field__input} type={secondPasswordShowed == 'none' ? "password" : "text"} name="password" id="password" placeholder="Password"
                            onChange={(e) => setUserSecondPassword(e.target.value)}/>
                            <Visibility className={cl.icon}
                            onClick={() => {
                                setSecondPasswordNotShowed('none');
                                setSecondPasswordShowed('block')
                            }}
                            style={{display: secondPasswordNotShowed}}/>
                            <VisibilityOff className={cl.icon}
                            onClick={() => {
                                setSecondPasswordShowed('none');
                                setSecondPasswordNotShowed('block');
                            }}
                            style={{display: secondPasswordShowed}}/>
                        </div>
                    </div>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.button_handler}>
                    <button className={cl.btn_login}
                    onClick={() => buttonHander()}>Зарегестрироваться</button>
                    <a className={cl.registration}
                    onClick={() => window.location.href = "http://localhost:3000/login"}
                    >Войти в аккаунт</a>
                </div>
            </section>
        </div>
    );
}

export default Registration;