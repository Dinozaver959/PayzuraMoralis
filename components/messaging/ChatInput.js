import React from "react";

const ChatInput = () => {
  const [message, setMessage] = React.useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("Sending message: ", message);
    setMessage("");
  };

  const changeMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className='inbox__message__input'>
      <input type="text" placeholder="Type a message" onChange={changeMessage} />
      <button type='button' onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatInput