import React, { Fragment } from "react";
import Navigation from "../../components/Navigation";
import { BsChevronLeft } from "react-icons/bs";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const index = (props) => {
  const { Moralis } = useMoralis();
  const [message, setMessage] = React.useState("");
  const currentAccount = props.currentAccount;

  const newMessage = new Moralis.Object("Messages");

  const sendMessage = () => {
    newMessage.set('userId', currentAccount);
    newMessage.set('message', message);
    newMessage.save();
  }

  const getAllMessages = async () => {
    const result = await Moralis.Cloud.run("getAllMessages");
    setMessages(result)
  }

  const subscribeToMessages = async () => {
    let query = new Moralis.Query('Messages');
    let subscription = await query.subscribe();
    subscription.on('create', notifyOnCreate);
  }

  const onChangeText = (message) => {
    setMessage(message);
  }


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
          <div className='inbox__message__input'>
            <input type="text" placeholder="Type a message" onChange={onChangeText} />
            <button type='button' onClick={sendMessage}>Send</button>
          </div>
          </div>
        </div>
      </div>
    </div>
    
  </Fragment>
  )
}

export default index