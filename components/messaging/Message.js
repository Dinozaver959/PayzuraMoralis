import Moment from "react-moment";

const Message = (props) => {
  const { messageSender, messageReceiver, message } = props;

  const messageContent = message.name?.message
  const messageSenderLower = message.name?.sender
  const messageDate = message.name?.createdAt

  const isSender = messageSender === messageSenderLower;
  const truncateSenderAdress = messageSender ? messageSender.slice(0, 5) + "..." + messageSender.slice(-4) : "";
  const truncateReceiverAdress = messageReceiver ? messageReceiver.slice(0, 5) + "..." + messageReceiver.slice(-4) : "";

  
  return (
    <div className={`chatbox__message ${isSender ? "chatbox__message--right" : "chatbox__message--left"}`}>
      <div className="chatbox__message__box">
        <div className={`chatbox__message__innerdiv`}>
        {isSender ? (
            <div className='chatbox__message__innerdiv--right'>
              <small className="truncateAdress">{truncateSenderAdress}</small>
                <p>{messageContent}</p>
              <small className="timestamp--right">
                <Moment 
                  format='DD/MM/YYYY - HH:mm'
                  fromNow 
                  >
                  {messageDate}
                </Moment>
              </small>
            </div>
          ) : (
            <div className='chatbox__message__innerdiv--left'>
              <small>{truncateReceiverAdress}</small>
                <p>{messageContent}</p>
              <small className="timestamp">
                <Moment 
                  format='DD/MM/YYYY - HH:mm'
                  fromNow 
                  >
                  {messageDate}
                </Moment>
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message