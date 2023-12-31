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
import SendRequest from "../SendRequest/SendRequest";
import Comments from "../Comments/Comments";


const LeftMenu = () => {

    if(sessionStorage.getItem('login')) { 
    } else {
        window.location.href = "http://localhost:3000/login"
    }
    const curRole = sessionStorage.getItem('role');

    const [info, setInfo] = useState();
    let displays = JSON.parse(sessionStorage.getItem('items'));
    if(!displays && curRole == 3) {
        displays = {req: "none", adm: "none", shops: "none", sendReq: "none", coms: "none"}
    } else if (!displays && curRole == 1) {
        displays = {req: "none", adm: "none", shops: "none", sendReq: "block", coms: "none"}
    }


    // buyer
    const [comments, setComments] = useState(displays.coms);
    const [sendRequest, setSendRequest] = useState(displays.sendReq);


    // admin
    const [requests, setRequests] = useState(displays.req);
    const [toAdmin, setToAdmin] = useState(displays.adm);
    const [shops, setShops] = useState(displays.shops);

    const requestHandler= () => {
        setRequests('block');
        setToAdmin('none');
        setShops('none');
        setComments('none');
        setSendRequest('none');
        sessionStorage.setItem('items', JSON.stringify({req: "block", adm:"none", shops:"none", sendReq: "none", coms: "none"}));
    }

    const adminHandler= () => {
        setRequests('none')
        setToAdmin('flex');
        setShops('none');
        setComments('none');
        setSendRequest('none');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"flex", shops:"none", sendReq: "none", coms: "none"}));
        console.log(sessionStorage.getItem('items'));
    }

    const shopsHandler= () => {
        setRequests('none');
        setToAdmin('none');
        setShops('block');
        setComments('none');
        setSendRequest('none');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"none", shops:"block", sendReq: "none", coms: "none"}));
    }

    const sendRequestHandler = () => {
        setRequests('none');
        setToAdmin('none');
        setShops('none');
        setComments('none');
        setSendRequest('block');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"none", shops:"none", sendReq: "block", coms: "none"}));
    }

    const comsHandler = () => {
        setRequests('none');
        setToAdmin('none');
        setShops('none');
        setComments('flex');
        setSendRequest('none');
        sessionStorage.setItem('items', JSON.stringify({req: "none", adm:"none", shops:"none", sendReq: "none", coms: "flex"}));
    }
    const admin = [
        {id: 0, text:"Заявки", icon: RequestController, callback: requestHandler},
        {id: 1, text:"Повысить до админа", icon: ToAdmin, callback: adminHandler},
        {id: 2, text:"Магазины",icon: ShopController, callback: shopsHandler},
        {id: 3, text:"Стать покупателем",icon: ToBuyer}
    ];

    const seller = [
        {id: 0, text:"Отправить заявку", icon: RequestController, callback: sendRequestHandler},
        {id: 1, text:"Комментарии", icon:Comment, callback: comsHandler}
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
                        onClick={() => item.callback()}>
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
            {curRole == 3 ? 
            <div className={cl.item_handler}> 
                <Requests visible = {requests} />
                <UpgradeToAdmin visible = {toAdmin}/>
                <Shops visible = {shops}/>
            </div>
            : curRole == 1 ?
            <div className={cl.item_handler}>
                <SendRequest visible={sendRequest}/>
                <Comments visible={comments}/>
            </div> : null}
        </section>
    );
}

export default LeftMenu;