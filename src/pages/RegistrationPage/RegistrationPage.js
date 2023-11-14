import React, { useState } from "react";
import cl from "./RegistrationPage.module.css"
import Registration from "../../components/UI/Registration/Registration";

const RegistrationPage = () => {

    return (
        <main className={cl.root}> 
            <Registration/>
        </main>
    );
}

export default RegistrationPage