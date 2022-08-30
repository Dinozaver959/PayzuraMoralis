import React, { useState, useRef, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Message from './Message';

const Messages = (props) => {
  const { Moralis } = useMoralis();
  const currentAccount = props.currentAccount;
  const userAddress = props.userAddress;
  const [message, setMessage] = useState("");
  const endOfMessages = useRef(null);
  const truncateAccountAddress = currentAccount ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : "";

  // useEffect(() => {
  //   endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  // }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const Messages = Moralis.Object.extend("Messages");
    const newMessage = new Messages();
    
    newMessage.save({
      message: message,
      sender: currentAccount,
      receiver: userAddress,
    }).then((message) => {
      console.log("New message created with objectId: " + message.id);
      console.log("receiver :", message.get("receiver"));
    },
    (error) => {
      console.log(error.message);
    });
    
    setMessage("");

    // endOfMessages.current.scrollIntoView({ behavior: "smooth"});
  }

  const { data: messageData } = useMoralisQuery(
    "Messages",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );


  return (
    <div className="chatbox">
      {messageData.map((message) => (
        <Message
          key={message.id}
          message={message}
          currentAccount={currentAccount}
        />
      ))}
      <div ref={endOfMessages}></div>

      <div className="inbox__message__footer">
        <form className='inbox__message__input'>
          <input type="text" value={message} placeholder={`Type a message ${truncateAccountAddress}`} onChange={e => setMessage(e.target.value)} />
          <button type='submit' onClick={sendMessage} disabled={!message.trim()}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Messages