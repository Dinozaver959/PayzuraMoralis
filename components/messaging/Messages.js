import React, { useState, useRef, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import{ BsEmojiSmile } from "react-icons/bs";
import { IoImagesOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useRouter } from "next/router";
import SendMessage from "./SendMessage";
import Message from "./Message";

const Divider = ({ children }) => {
  return (
    <div className="container">
      <div className="border" />
        <span className="content">
          {children}
        </span>
      <div className="border" />
    </div>
  )
}

const Messages = (props) => {
  const { currentAccount, userAddress } = props;
  const endOfMessages = useRef(null);

  const { data: messageData } = useMoralisQuery(
    "Messages",
    (query) =>
      query.ascending("createdAt"),
      // .equalTo("sender", currentAccount)
      // .equalTo("receiver", userAddress),
    [],
    { live: true }
  );

  console.log("messageData", messageData);

  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  const scrollToBottom = () => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chatbox">
      {messageData.map((message) => (
        <Message 
          key={message.id}
          message={message}
          currentAccount={currentAccount}
        />
      ))}

      <div>
        <SendMessage currentAccount={currentAccount} endOfMessages={endOfMessages}/>
      </div>
      <h4 ref={endOfMessages}>
        <Divider>You're up to date !</Divider>
      </h4>
    </div>
  )
}

export default Messages;