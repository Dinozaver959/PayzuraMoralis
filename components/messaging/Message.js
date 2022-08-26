const Message = (props) => {
  const { currentAccount, message } = props;
  const isUserMessage = message.get("sender") === currentAccount;
  
  return (
    <div className={`chatbox__message ${isUserMessage && "chatbox__message__outerdiv"}`}>
      <div className={`chatbox__message__innerdiv ${isUserMessage ? "chatbox__message__sender" : "chatbox__message__receiver"}`}>
        <small>{message.get("sender")}</small>
        <p>{message.get("message")}</p>
      </div>
    </div>
  )
}

export default Message