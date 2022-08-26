const Message = (props) => {
  const { currentAccount, message } = props;

  const isUserMessage = message.get("sender") === currentAccount;

  return (
    <div>
      {/* classname -> isUserMessage ? "rightside of the chatbox" : "leftside of the chatbox" */}
      <div>
        <p>{message.get("message")}</p>
        <p>message</p>
      </div>
    </div>
  )
}

export default Message