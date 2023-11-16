import React, { useState } from "react";
import cl from "./UpgradeToAdmin.module.css"
import { upToAdmin } from "../../../web3/contractController";

const UpgradeToAdmin = ({visible}) => {

    const [address, setAddress] = useState('');

    const upgradeHandler = async () => {
        const curAddress = sessionStorage.getItem('address');
        
        if (address.length !== 42) {
            alert("Неверно написан адрес")
            return
        }

        await upToAdmin(address, curAddress);
        alert("Повышение до админа успешно")
    }

    return (
        <section className={cl.root} style={{display: visible}}>
            <div className={cl.main_menu}>
                <div className={cl.header}>
                    <h1 className={cl.title}>Повышение до администратора</h1>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.main}>
                    <input className={cl.address} type="text" placeholder="Адрес"
                    onChange={(e) => setAddress(e.target.value)}
                    />
                    <button className={cl.button}
                    onClick={() => upgradeHandler()}
                    >Повысить</button>
                </div>
            </div>
        </section>
    );
}

export default UpgradeToAdmin;