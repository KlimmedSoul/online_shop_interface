import React, { useEffect, useState } from "react"; 
import cl from "./Requests.module.css" 
import { getRequests, rejectRequest, acceptRequest } from "../../../web3/contractController"; 

const Requests = ({ visible }) => { 
    const [doneRequests, setDoneRequests] = useState([]); 
    const [incomingRequests, setIncomingRequests] = useState([]); 
 
    const allRequests = async () => {  
        const result = await getRequests();  
 
        const newDoneRequests = []; 
        const newIncomingRequests = []; 
        
        for (let i = 0; i < result.length; i++) { 
            if (!result[i].done) { 
                let obj = {
                    id: i, 
                    address: result[i].user_address, 
                    date: Number(result[i].date), 
                    role: Number(result[i].role)
                }; 
                newDoneRequests.push(obj); 
            } else {
                let obj = {
                    id: i, 
                    address: result[i].user_address, 
                    date: Number(result[i].date), 
                    role: Number(result[i].role),
                    accept: result[i].accepted
                };
                newIncomingRequests.push(obj); 
            }  
        } 
        setDoneRequests(newDoneRequests); 
        setIncomingRequests(newIncomingRequests); 
    };  
 
    useEffect(() => { 
        allRequests(); 
    }, []); 
 
    const dateHandler = (timestamp) => {
        const date = new Date(timestamp*1000)
        const formateDate = date.toLocaleDateString('ru-RU')
        return formateDate
    }

    const rejectHandler = async (id) => {
        const address = sessionStorage.getItem('address');

        await rejectRequest(id, address)
        alert("Заявка успешно отклонена")
        window.location.reload();
    }

    const acceptHandler = async (id) => {
        const address = sessionStorage.getItem('address');

        await acceptRequest(id, address)
        alert("Заявка успешно принята")
        window.location.reload();
    }

    return ( 
        <section className={cl.root} style={{ display: visible }}> 
            <div className={cl.tables}>
                <div className={cl.done_requests} style={{overflow: "auto"}}> 
                    {doneRequests ? doneRequests.map(item => ( 
                        <div className={cl.request_handler} key={item.id}> 
                            <div className={cl.request_info}> 
                                <h4 className={cl.address_title}>Адрес: <span className={cl.address}>{item.address}</span></h4> 
                                <h4 className={cl.date_title}>Дата: <span className={cl.date}>{dateHandler(item.date)}</span></h4> 
                                <h4 className={cl.role}>{item.role == 2 ? "Хочет стать покупателем" : "Хочет стать продавцом"}</h4> 
                            </div> 
                            <div className={cl.button_handler}> 
                                <button className={cl.btn_accept}
                                onClick={() => acceptHandler(item.id)}
                                >Принять</button> 
                                <button className={cl.btn_reject}
                                onClick={() => rejectHandler(item.id)}
                                >Отклонить</button> 
                            </div> 
                        </div>
                        
                    )) : null} 
                </div> 
                <div className={cl.outgoing_requests}> 
                    {incomingRequests ? incomingRequests.map(item => ( 
                        <div className={cl.request_handler}> 
                            <div className={cl.request_info}> 
                                <h4 className={cl.address_title}>Адрес: <span className={cl.address}>{item.address}</span></h4> 
                                <h4 className={cl.date_title}>Дата: <span className={cl.date}>{dateHandler(item.date)}</span></h4> 
                                <h4 className={cl.role}>{item.role == 2 ? "Хочет стать покупателем" : "Хочет стать продавцом"}</h4> 
                                <h4 className={cl.accept_or_reject} 
                                style={item.accept == true ? {color: "green"} : {color: "red"}}
                                >{item.accept == true ? "Принята" : "Отклонена" }</h4>
                            </div>
                        </div>  
                    )) : null} 
                </div>
            </div>
        </section> 
    ); 
}; 
 
export default Requests;