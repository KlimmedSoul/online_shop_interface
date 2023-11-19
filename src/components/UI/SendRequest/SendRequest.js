import React, { useEffect, useState } from "react"; 
import cl from "./SendRequest.module.css" 
import { getUserRequest, sendRequest } from "../../../web3/contractController";

const SendRequest = ({ visible }) => { 

    const [req, setReq] = useState();

    const reqHandler = async () => {
        const res = await getUserRequest(sessionStorage.getItem('address'));
        setReq(res);
    }

    useEffect(() => {
        reqHandler();
    }, [])

    const sendReqHandler = async () => {
        await sendRequest(sessionStorage.getItem('address'))
        alert("Ваша заявка отправлена");
        window.location.reload();
    }

    return ( 
        <section className={cl.root} style={{ display: visible }}> 
            <div className={cl.handler}>
                <div className={cl.request_handler}>
                    {!req ? 
                    <div className={cl.main}>
                        {sessionStorage.getItem('role') == 1 ? <h1 className={cl.title}>Отправить заявку на повышение</h1> : <h1 className={cl.title}>Отправить заявку на понижение</h1>}
                        <button className={cl.btn}
                        onClick={() => sendReqHandler()}>Отправить</button>
                    </div>
                    :
                    <div className={cl.main}>
                        <h1 className={cl.processing}>Ваша заявка все еще в процессе обработки администраторами</h1>
                    </div>}
                </div>
            </div>
        </section> 
    ); 
}; 
 
export default SendRequest;