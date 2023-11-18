import React, {useEffect, useState} from "react";
import cl from "./Shops.module.css"
import { getAllShops, removeSeller, addSeller, removeShop } from "../../../web3/contractController";

const Shops = ({visible}) => {

    const [allShops, setAllShops] = useState([]);
    const [sellerAddress, setSellerAddress] = useState('');

    const deleteSellerHandler = async (id, shop) => {
        const address = sessionStorage.getItem('address');

        await removeSeller(address, id, shop);
        alert("Продавец успешно удален")
        window.location.reload();
    }

    const addSellerHandler = async (shopAddress) => {
        const address = sessionStorage.getItem('address');
        await addSeller(shopAddress, sellerAddress, address);

        alert("Продавец добавлен");
        window.location.reload();
    } 

    const deleteShopHandler = async (shopAddress) => {
        const address = sessionStorage.getItem('address');

        await removeShop(address, shopAddress);

        alert("Магазин удален")
        window.location.reload();
    }

    useEffect(() => {
        const shopsHandler = async () => {
            console.log(123);
            const shops = await getAllShops();
            setAllShops([...allShops, ...shops]);
        }
        shopsHandler()  
    }, [])

    return (
        <section className={cl.root} style={{display: visible}}>
           <div className={cl.main}>
               <div className={cl.all_shops}>
                    {allShops.map((shop, index) => (
                        <div key={index} className={cl.shop}>
                            <div className={cl.shop_header}>
                                <h2 className={cl.shop_town}> Город: <span className={cl.town}>{shop.town}</span></h2>
                            </div>
                            <div className={cl.seller_and_delete}>
                                <div className={cl.sellers}>
                                    <h2 className={cl.all_sellers}>Адреса продавцов</h2>
                                    {shop.sellers.map((seller, id) => (
                                        <div className={cl.seller_handler}>
                                            <h3 className={cl.seller}>{seller.slice(0,20) + "..."}</h3>
                                            <button
                                            onClick={ async () =>  deleteSellerHandler(id, shop.address)}
                                            >-</button>
                                        </div>
                                    ))}
                                    <div className={cl.add_seller}>
                                        <input type="text" placeholder="Введите адрес" onChange={(e) => setSellerAddress(e.target.value)}/>
                                        <button
                                        onClick={() => addSellerHandler(shop.address)}>+</button>
                                    </div>
                                </div>
                                <div className={cl.delete_shop}> 
                                    <button className={cl.delete_shop_btn}
                                    onClick={() => deleteShopHandler(shop.address)}>Удалить магазин</button>
                                </div>
                            </div>
                        </div>    
                    ))}
               </div>
               <div className={cl.add_shop}>
                    <div className={cl.add_header}>
                        <h2 className={cl.title_add}>Добавить магазин</h2>
                    </div>
                    <hr className={cl.hr}/>

                    <div className={cl.inputs}>
                        <input/>
                        <input/>
                    </div>
                    <div className={cl.button_add}></div>
               </div>

           </div>
        </section>
    );
}

export default Shops;