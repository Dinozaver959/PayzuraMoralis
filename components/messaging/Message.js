import React from 'react'
import Moment from 'react-moment';

const Message = (props) => {
  const { currentAccount, message } = props;

  const isUserMessage = message.get("sender") === currentAccount;

  const truncateAccountAddress = message.get("sender") ? message.get("sender").slice(0, 5) + "..." + message.get("sender").slice(-4) : "";

  return (
    <div className={`chatbox__message ${isUserMessage ? "chatbox__message--right" : "chatbox__message--left"}`}>
      <div className="chatbox__message__box">
        <div className={`chatbox__message__innerdiv`}>
          {isUserMessage ? (
            <div className='chatbox__message__innerdiv--right'>
              <small>{truncateAccountAddress}</small>
                <p>{message.get("message")}</p>
              <small className="timestamp">
                <Moment 
                  format='DD/MM/YYYY - HH:mm'
                  fromNow 
                  >
                  {message.get("createdAt")}
                </Moment>
              </small>
            </div>
          ) : (
            <div className='chatbox__message__innerdiv--left'>
              <small>{truncateAccountAddress}</small>
                <p>{message.get("message")}</p>
              <small className="timestamp">
                <Moment 
                  format='DD/MM/YYYY - HH:mm'
                  fromNow 
                  >
                  {message.get("createdAt")}
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