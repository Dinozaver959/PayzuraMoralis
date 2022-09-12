import Moment from "react-moment";
import { BsCheckAll } from "react-icons/bs";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Message = (props) => {
  const { messageSender, messageReceiver, message } = props;
  const router = useRouter();

  const messageContent = message.name?.message
  const messageSenderLower = message.name?.sender
  const messageDate = message.name?.createdAt

  const isSender = messageSender === messageSenderLower;
  const truncateSenderAdress = messageSender ? messageSender.slice(0, 5) + "..." + messageSender.slice(-4) : "";
  const truncateReceiverAdress = messageReceiver ? messageReceiver.slice(0, 5) + "..." + messageReceiver.slice(-4) : "";

  useEffect(() => {
    if (messageSender === messageReceiver) {
      router.push("/messages");
    }
  }, [messageSender, messageReceiver]);

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
              <div className="chatbox__message__sent">
                <small>Sent</small>
                <BsCheckAll size={16} />
              </div>
            </div>
          ) : (
            <div className='chatbox__message__innerdiv--left'>
              <small>{truncateReceiverAdress}</small>
                <p>{messageContent}</p>
              <small className="timestamp--left">
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