import React, { Fragment } from "react";
import Navigation from "../../components/Navigation";
import ChatInput from "../../components/messaging/ChatInput";
import { BsChevronLeft } from "react-icons/bs";
import Link from "next/link";

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
        <div className="inbox__users">
          <h2>All Conversations</h2>
          <div className="inbox__users__list">
              <div className="inbox__users__list__item">
                <div className="inbox__users__list__item__header">
                  <div>
                    <span className="inbox__users__list__item__username">test</span>
                    <span>(0xd...04e)</span>
                  </div>
                  <span>2 hours ago</span>
                </div>
                <div className="inbox__users__list__item__message">
                  <p>Here will be displayed the last message</p>
                </div>
              </div>
          </div>
        </div>
        <div className="inbox__message">
          <div className="inbox__message__title">
            <Link href="/messages">
              <BsChevronLeft size={24} className="inbox__message__back__button"/>
            </Link>
            <h2>test (0xd...04e)</h2>
          </div>
          <div className="inbox__message__content">
            {/* Conversation */}
          </div>
          <div className="inbox__message__footer">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
    
  </Fragment>
  )
}

export default index