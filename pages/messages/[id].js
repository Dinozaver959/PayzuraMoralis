import React, { Fragment } from "react";
import Navigation from "../../components/Navigation";
import { BsChevronLeft } from "react-icons/bs";
import Link from "next/link";
import Messages from "../../components/messaging/Messages";
import { useMoralisQuery } from "react-moralis";
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";

const index = (props) => {
  const { currentAccount } = props;
  const userAddress = props.userAddress;
  const { data } = useMoralisQuery(
    "UserParticipationData",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );


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
      setCurrentAccount={props.setCurrentAccount}
    />
    <div className="containerMain">
      <div className="inbox">
        <div className="inbox__users">
          <MessagesUsersList />
        </div>
        <div className="inbox__message">
          <div className="inbox__message__title">
            <Link href="/messages">
              <BsChevronLeft size={24} className="inbox__message__back__button"/>
            </Link>
            <h2>Receiver's userAddress</h2>
          </div>
          <div className="inbox__message__content">
            <Messages currentAccount={currentAccount} userAddress={userAddress}/>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
  )
}

export default index