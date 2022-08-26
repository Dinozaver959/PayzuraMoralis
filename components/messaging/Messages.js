import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Message from './Message';

const Messages = (props) => {
  const { data } = useMoralisQuery(
    "Messages", 
    (query) => {
      query
        .ascending("createdAt"),
    [],
    {
      live: true,
    };
  });

  const { Moralis } = useMoralis();
  const [message, setMessage] = useState("");
  const currentAccount = props.currentAccount;
  
  const truncateAccountAddress = currentAccount ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : "";
  
  const sendMessage = (e) => {
    if(!message) return;
    
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
    console.log("Sending message", message);
  }
  
  const onChangeText = (e) => {
    setMessage(e.target.value)
  }

  const handleKeypress = e => {
  // it triggers by pressing the Enter key
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <div>
      {data.map((message) => (
        <Message
          key={message.id}
          message={message}
          currentAccount={currentAccount}
        />
      ))}

       <div className="inbox__message__footer">
          <div className='inbox__message__input'>
            <input type="text" value={message} placeholder={`Type a message ${truncateAccountAddress}`} onChange={onChangeText} onKeyDown={handleKeypress} />
            <button type='submit' onClick={sendMessage} disabled={!message.trim()}>Send</button>
          </div>
        </div>
    </div>
  )
}

export default Messages