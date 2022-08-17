import React, { Fragment } from "react";
import Navigation from "../../components/Navigation";
import { ImBubbles2 } from "react-icons/im";
import { MessagesUsersList } from "../../components/messaging/MessagesUsersList";

const index = (props) => {
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
          <MessagesUsersList />
          <div className="inbox__chat">
            <ImBubbles2 size={100}/>
            <h1>Select a Conversation</h1>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index