import React, {useEffect, useState} from "react";
import cl from "./Comments.module.css"
import { getShopsAddresses, getShopGrades } from "../../../web3/contractController";

import Like from '@mui/icons-material/ThumbUp';
import Dislike from '@mui/icons-material/ThumbDownAlt';

const Comments = ({visible}) => {

    const [allShops, setAllShops] = useState([]);
    const [coms, setComs] = useState([ ]);

    const [gradeText, setGradeText] = useState('');
    const [grade, setGrade] = useState(1);

    const [curShop, setCurShop] = useState(allShops[1]);
    const rates = [1,2,3,4,5,6,7,8,9,10];
    const getShops = async () => {
        const shops = await getShopsAddresses();
        setAllShops(shops);
        setCurShop(shops[0]);
    }

    const getComments = async () => {
        const newComs = await getShopGrades(curShop);
        setComs(newComs);
    }

    useEffect(() => {
        getShops();
        getComments();
    }, [])

    return (
        <section className={cl.root} style={{display: visible}}>
            <div className={cl.main}>
                <div className={cl.header}>
                    <h1 className={cl.title}>Выберите магазин</h1>
                    <select className={cl.shop_select}
                    onChange={(e) => setCurShop(e.target.value)}>
                        {allShops.map(item => (
                            <option>{item}</option>
                        ))}
                    </select>
                </div>
                <hr className={cl.hr}/>
                <div className={cl.comments}>
                    {coms.map(item => ( 
                        <div className={cl.comment_handler}>
                            <p className={cl.rate}>{Number(item.rating)}</p>
                            <p className={cl.text}>{item.text}</p>
                            <div className={cl.rate_handler}>
                                <Like/>
                                <p className={cl.rate_num}>{Number(item.likes)}</p>
                            </div> 
                            <div className={cl.rate_handler}>
                                <Dislike/>
                                <p className={cl.rate_num}>{Number(item.dislikes)}</p>
                            </div> 
                        </div>
                    ))}
                </div>
                <hr className={cl.hr}/>
                <div className={cl.input}>
                    <select className={cl.select_rate}
                    onChange={(e) => setGrade(e.target.value)}>
                        {rates.map(item => (
                            <option className={cl.option_rate}>{item}</option>
                        ))}
                    </select>
                    <div className={cl.input_handler}>
                        <textarea id="text" placeholder="Текст оценки" type="text" maxLength="256" className={cl.input_text}
                        onChange={(e) => setGradeText(e.target.value)}/>
                    </div>
                    <button className={cl.send_rate}>Отправить</button>
                </div>
            </div>
        </section>
    );
}

export default Comments;