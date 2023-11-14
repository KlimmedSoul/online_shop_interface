import React, { useState } from "react";
import cl from "./LoginPage.module.css"
import Login from "../../components/UI/Login/Login";

const LoginPage = () => {

    return (
        <main className={cl.root}> 
            <Login/>
        </main>
    );
}

export default LoginPage