import React from 'react';
import {AiOutlineWallet} from "react-icons/ai";
import {useMoralis} from "react-moralis";

const style = {
    headerItem: `px-2 py-2 cursor-pointer`,
    headerIcon: `text-2xl px-2 py-2 cursor-pointer`,
}

function LoginButton() {

    const {isAuthenticated, logout, authenticate} = useMoralis();      // add: web3 - read on it

    return (
        <>
            <div className={style.headerIcon} onClick={isAuthenticated ? logout : authenticate}>
                <AiOutlineWallet />
            </div>
        </> 
    )
}

export default LoginButton