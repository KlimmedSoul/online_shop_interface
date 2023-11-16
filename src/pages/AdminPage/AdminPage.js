import React from "react";
import cl from "./AdminPage.module.css"
import LeftMenu from "../../components/UI/LeftMenu/LeftMenu";

const Admin = () => {

    return (
        <main className={cl.root}>
            <LeftMenu/>
        </main>
    );
}

export default Admin;