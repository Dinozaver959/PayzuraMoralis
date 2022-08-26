import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Message from './Message';

const Messages = (props) => {
  const { Moralis } = useMoralis();
  const currentAccount = props.currentAccount;
  const [message, setMessage] = useState("");
  const truncateAccountAddress = currentAccount ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : "";

  const sendMessage = () => {
    const Messages = Moralis.Object.extend("Messages");
    const newMessage = new Messages();
    
    newMessage.save({
      message: message,
      sender: currentAccount,
    }).then((message) => {
      console.log("New message created with objectId: " + message.id);
    },
    (error) => {
      console.log(error.message);
    });
    
    setMessage("");
  }

  const { data } = useMoralisQuery(
    "Messages",
    (query) =>
      query.ascending("createdAt"),
    [],
    { live: true }
  );

  return (
    <div className="chatbox">
      {data.map((message) => (
        <Message
          key={message.id}
          message={message}
          currentAccount={currentAccount}
        />
      ))}

      {/* <SendMessage truncateAccountAddress={currentAccount} /> */}
      <div className="inbox__message__footer">
        <form className='inbox__message__input'>
          <input type="text" value={message} placeholder={`Type a message ${truncateAccountAddress} `} onChange={e => setMessage(e.target.value)} />
          <button type='submit' onClick={sendMessage} disabled={!message.trim()}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Messages