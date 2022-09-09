import React, { Fragment, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { BsChevronLeft } from "react-icons/bs";
import Link from "next/link";
import Messages from "../../components/messaging/Messages";
import { useRouter } from 'next/router';
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";

const index = (props) => {
  const { currentAccount } = props;
  const router = useRouter();
  const userAddress = router.query.id;

  const truncateAccountAddress = userAddress ? userAddress.slice(0, 5) + "..." + userAddress.slice(-4) : "";

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
      currentAccount={props.currentAccount}
      userAddress={props.userAddress}
      setUserAddress={props.setUserAddress}
      setCurrentAccount={props.setCurrentAccount}
    />
    <div className="containerMain">
      <div className="inbox">
        <div className="inbox__users">
          <MessagesUsersList currentAccount={currentAccount} userAddress={userAddress}/>
        </div>
        <div className="inbox__message">
          <div className="inbox__message__title">
            <Link href="/messages">
              <BsChevronLeft size={24} className="inbox__message__back__button"/>
            </Link>
            <h2>{truncateAccountAddress}</h2>
          </div>
          <div className="inbox__message__content">
            <Messages currentAccount={currentAccount} userAddress={userAddress} />
          </div>
        </div>
      </div>
    </div>
  </Fragment>
  )
}

export default index