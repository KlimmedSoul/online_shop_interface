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

    const [firstPassword, setFirstPassword] = useState('none');
    const [secondPassword, setSecondPassword] = useState('none');

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
    const redirect =  () => {
        const role = sessionStorage.getItem("role");
        let link = "";
        if (role == 1) {
            link = "buyer";
        } else if (role == 2) {
            link = "seller";
        } else if (role == 3) {
            link = "admin"
        }

        window.location.href = `http://localhost:3000/${link}`
    }

    return (
        <div className={cl.root}>
            {sessionStorage.getItem("login") == false || sessionStorage.getItem("login") == null ? 
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
                            <input className={cl.text_field__input} type={firstPassword == 'none' ? "password" : "text"} name="password" id="password" placeholder="Password"
                            onChange={(e) => setUserPassword(e.target.value)}/>
                            {firstPassword == 'none' ? <Visibility onClick={()=> setFirstPassword('block')}/> : <VisibilityOff onClick={()=> setFirstPassword('none')}/>}
                        </div>
                    </div>

                    <div className={cl.text_field}>
                        <h1 className={cl.text_field__label} for="password">Повторите пароль</h1>
                        <div className={cl.input_handler}>
                            <input className={cl.text_field__input} type={secondPassword == 'none' ? "password" : "text"} name="password" id="password" placeholder="Password"
                            onChange={(e) => setUserSecondPassword(e.target.value)}/>
                            {secondPassword == 'none' ? <Visibility onClick={()=> setSecondPassword('block')}/> : <VisibilityOff onClick={()=> setSecondPassword('none')}/>}
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
            :
            redirect()
            }
        </div>
    );
}

export default Registration;