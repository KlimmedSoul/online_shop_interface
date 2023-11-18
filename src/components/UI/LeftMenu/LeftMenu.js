import React, {useEffect, useState} from "react";
import cl from "./LeftMenu.module.css"
import RequestController from '@mui/icons-material/KeyboardTab';
import ToAdmin from '@mui/icons-material/CoPresent';
import ToBuyer from '@mui/icons-material/Outlet';
import ShopController from '@mui/icons-material/ShoppingCart';
import Logout from '@mui/icons-material/Logout';
import Comment from '@mui/icons-material/InsertComment';
import { getUserInfoLogin } from "../../../web3/contractController";
import Requests from "../Requests/Requests";
import UpgradeToAdmin from "../UpgradeToAdmin/UpgradeToAdmin";
import Shops from "../Shops/Shops";

const LeftMenu = () => {

    if(sessionStorage.getItem('login')) { 
    } else {
        window.location.href = "http://localhost:3000/login"
    }

    const [info, setInfo] = useState();

    let displays = JSON.parse(sessionStorage.getItem('items'));
    if(!displays) {
        displays = {req: "block", adm: "none", shops: "none"}
    }
    const [requests, setRequests] = useState(displays.req);
    const [toAdmin, setToAdmin] = useState(displays.adm);
    const [shops, setShops] = useState(displays.shops);

    const [coms, setComs] = useState('none');

    const requestHandler= () => {
        setRequests('block');
        setToAdmin('none');
        setShops('none');
        sessionStorage.setItem('items', JSON.stringify({req: "block", adm:"none", shops:"none"}));
    }

    const adminHandler= () => {
        setRequests('none')
        setToAdmin('flex');
        setShops('none');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"flex", shops:"none"}));
        console.log(sessionStorage.getItem('items'));
    }

    const shopsHandler= () => {
        setRequests('none');
        setToAdmin('none');
        setShops('block');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"none", shops:"block"}));
    }


    const admin = [
        {id: 0, text:"Заявки", icon: RequestController, callback: requestHandler},
        {id: 1, text:"Повысить до админа", icon: ToAdmin, callback: adminHandler},
        {id: 2, text:"Магазины",icon: ShopController, callback: shopsHandler},
        {id: 3, text:"Стать покупателем",icon: ToBuyer}
    ];

    const seller = [
    {id: 0, text:"Отправить заявку", icon: RequestController, controller: setRequests, display: requests},
    {id: 1, text:"Комментарии", icon:Comment, controller: setComs, display: coms}
    ];



    const getInfo = async () => {
        const address = sessionStorage.getItem("address"); 
        const info = await getUserInfoLogin(address);
            
        setInfo(info);
    }

    const logout = () => {
        sessionStorage.clear();
        window.location.href = "http://localhost:3000/login"
    }

    useEffect(() => {
        getInfo();
    }, [])


    return (
        <section className={cl.root}>
            <div className={cl.left_menu}>
                <div className={cl.title_handler}>
                    <div className={cl.title_part}>
                        <h1 className={cl.title}>Адрес</h1>
                        <p className={cl.title_text}>{sessionStorage.getItem("address").slice(1, 20) + "..."}</p>
                    </div>
                    <div className={cl.title_part}>
                        <h1 className={cl.title}>Email</h1>
                        <p className={cl.title_text}>{info?.email ? info.email: null}</p>
                    </div>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.buttons_handler}>
                    {sessionStorage.getItem('role') == 3 ? admin.map(item => (
                        <div key={item.id} className={cl.button_handler}
                        onClick={() => item.callback()}>
                            <item.icon className={cl.icon} style={{width: "50px", height: "50px"}}/>
                            <h3 className={cl.title_text}>{item.text}</h3>
                        </div>    
                    ))
                : 
                    seller.map(item => (
                        <div key={item.id} className={cl.button_handler}
                        onClick={() => item.display == "none"}>
                            <item.icon className={cl.icon} style={{width: "50px", height: "50px"}}/>
                            <h3 className={cl.title_text}>{item.text}</h3>
                        </div>    
                    ))
                }
                </div>
                <hr className={cl.hr}/>
                <div className={cl.logout}
                onClick={logout}>
                    <Logout className={cl.icon} style={{width: "50px", height: "50px"}}/>
                    <h3 className={cl.title_text}>Выход</h3>
                </div>
            </div>
            <Requests visible = {requests} />
            <UpgradeToAdmin visible = {toAdmin}/>
            <Shops visible = {shops}/>
        </section>
    );
}

export default LeftMenu;