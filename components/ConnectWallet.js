import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import Modal from "./Modal";


const Web3 = require('web3');
const style = {
    headerItem: `px-2 py-2 cursor-pointer`,
    headerIcon: `text-2xl px-2 py-2 cursor-pointer`,
};

function checkConnection() {
    ethereum
        .request({ method: "eth_accounts" })
        .then(handleAccountsChanged)
        .catch(console.error);
}

/*
function handleAccountsChanged(accounts) {
    console.log(accounts);

    if (accounts.length === 0) {
        return false;
    } else if (accounts[0] !== currentAccount) {
        return true;
    }
}
*/

/*
    if (accounts.length === 0) {
        $('#connection-status').innerText = "You're not connected to MetaMask";
        $('#connect-btn').disabled = false;
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        $('#connection-status').innerText = `Address: ${currentAccount}`;
        $('#connect-btn').disabled = true;
    }
*/

/*
const provider = new Web3Provider(wallet);
await provider.send('eth_requestAccounts', []);
const signer = await provider.getSigner(0);

if (signer === undefined) userIsNotConnected();
else userIsConnected();

*/

/*
window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!

})
*/

/*
useEffect( () =>{
    const onNewSigner = async () =>{
      let addr;
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        addr = await signer.getAddress();

        setUserAddress(addr.toString());
      }
    }

    onNewSigner();
}, []);
*/

function ConnectWallet() {
    const [currentAccount, setCurrentAccount] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [chainId, setChainId] = useState("");

    const detailsOn = async () => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const addr = await signer.getAddress();

        setUserAddress(addr.toString());
    };

    /*
    const handleAccountsChanged = (accounts) => { 
        if (accounts.length === 0) { 
            console.log('Please connect to MetaMask.(handleaccounts)'); 
            setCurrentAccount(""); 
            //setUserBalance(0); 
            //setLoading(false);
         } else if (accounts[0] !== currentAccount) { 
            setCurrentAccount(accounts[0]); 
            console.log("Account connected ", accounts[0]); 
        } 
    } 
    ethereum.on('accountsChanged', handleAccountsChanged); 
    */

    const truncateAccountAddress = currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4);

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

    const connectWallet = async () => {
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

        // not working properly
        /*
        const handleChainChanged = async (chainId) => {
            const chainId_ = await ethers.getDefaultProvider().getNetwork().chainId;  
            console.log(`Chain id: ${chainId_}`);
            setChainId(chainId_);

            const chainName_ = await ethers.getDefaultProvider().getNetwork().name;
            console.log(`Chain name: ${chainName_}`);
        }
        */

        checkIfWalletIsConnected();

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
            //window.ethereum.on("chainChanged", handleChainChanged);
        }
    }, []);

    return (
        <>
            {!currentAccount ? (
                <>
                    <button
                        className="button default rounded"
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </button>
                </>
            ) : (
                <div>
                    <div className="addressButton">
                        <button className="button default rounded hoverModal">
                            {truncateAccountAddress}
                        </button>
                        <div className="Modal">
                            <Modal userDetails={userAddress} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConnectWallet;

