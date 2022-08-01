import React, { useState, useEffect, Fragment } from "react";
import { ethers } from "ethers";

const Web3 = require("web3");

function ConnectWallet(props) {
    const { currentAccount, setCurrentAccount } = props;
    const [userAddress, setUserAddress] = useState("");

    const detailsOn = async () => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const addr = await signer.getAddress();

        setUserAddress(addr.toString());
    };

    const truncateAccountAddress = (currentAccount) ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : '';

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Use Metamask!");
            } else {
                console.log("Ethereum object found", ethereum);
                detailsOn();
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account ", account);
                setCurrentAccount(Web3.utils.toChecksumAddress(account));
                detailsOn();
            } else {
                console.log("Could not find an authorized account");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWalletFn = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Use Metamask!");
            } else {
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                console.log("Account connected ", accounts[0]);
                setCurrentAccount(Web3.utils.toChecksumAddress(accounts[0]));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
            if (accounts.length > 0) {
                //console.log(`Using account ${accounts[0]}`);
                setCurrentAccount(Web3.utils.toChecksumAddress(accounts[0]));
            } else {
                console.error("0 accounts");
            }
        };

        checkIfWalletIsConnected();

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
            //window.ethereum.on("chainChanged", handleChainChanged);
        }
    }, []);

    return (
        <Fragment>
            {!currentAccount ? (
                <button
                    className="button default rounded"
                    onClick={connectWalletFn}
                >
                    Connect Wallet
                </button>
            ) : (
                <button className="button default rounded">
                    {truncateAccountAddress}
                </button>
            )}
        </Fragment>
    );
}

export default ConnectWallet;
