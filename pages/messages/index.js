import React, { Fragment, useState } from "react";
import Navigation from "../../components/Navigation";
import { ethers } from "ethers";
import { ImBubbles2 } from "react-icons/im";
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";
import { useEffect } from "react";

const Web3 = require("web3");

const index = (props) => {
  const { currentAccount, setCurrentAccount, userAddress } = props;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Use Metamask!");
      } else {
        console.log("Ethereum object found", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account ", account);
        setCurrentAccount(Web3.utils.toChecksumAddress(account));
      } else {
        console.log("Could not find an authorized account");
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
      <Navigation
        darkMode={props.darkMode}
        changeDarkMode={props.changeDarkMode}
        dropdownOpen={props.dropdownOpen}
        setDropdownOpen={props.setDropdownOpen}
        OpenDropdownFn={props.OpenDropdownFn}
        hasMenuDrawer={props.hasMenuDrawer}
        setMenuDrawer={props.setMenuDrawer}
        mobileDrawerFn={props.mobileDrawerFn}
        userAddress={props.userAddress}
        setUserAddress={props.setUserAddress}
        currentAccount={props.currentAccount}
        setCurrentAccount={props.setCurrentAccount}
      />
      <div className="containerMain">
        <div className="inbox">
          {!currentAccount ? (
            <>
              <div className="inbox__user__list__blurred">
                <MessagesUsersList userAddress={userAddress}/>
              </div> 
              <div className="inbox__chat">
                <ImBubbles2 size={100}/>
                <h1>Connect with your wallet to access your messages</h1>
              </div>
            </>
            ) : ( 
              <>
                <MessagesUsersList userAddress={userAddress}/>
                <div className="inbox__chat">
                  <ImBubbles2 size={100}/>
                  <h1>Select a Conversation</h1>
                </div>
              </>
            )}
        </div>
      </div>
    </Fragment>
  )
}

export default index