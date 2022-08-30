const Message = (props) => {
  const { currentAccount, message } = props;
  const isUserMessage = message.get("sender") === currentAccount;
  const truncateAccountAddress = message.get("sender") ? message.get("sender").slice(0, 5) + "..." + message.get("sender").slice(-4) : "";

  return (
    <div className={`chatbox__message ${isUserMessage && "chatbox__message__outerdiv"}`}>
      <div className={`chatbox__message__innerdiv ${isUserMessage ? "chatbox__message__sender" : "chatbox__message__receiver"}`}>
        <small>{truncateAccountAddress}</small>
        <p>{message.get("message")}</p>
      </div>
    </div>
  )
}

export default Message