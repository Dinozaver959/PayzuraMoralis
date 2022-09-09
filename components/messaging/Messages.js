import React, { useState, useRef, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import Message from './Message';
import{ BsEmojiSmile } from "react-icons/bs";
import { IoImagesOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const Messages = (props) => {
  const { Moralis } = useMoralis();
  const { currentAccount, userAddress } = props;
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false)
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const endOfMessages = useRef(null);
  const truncateReceiverAddress = userAddress ? userAddress.slice(0, 5) + "..." + userAddress.slice(-4) : "";

  const addEmoji = (e) => {
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach((el) => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setMessage(message + emoji)
  }

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }
  
  const messageSender = currentAccount.toLowerCase();
  const messageReceiver = userAddress?.toLowerCase();

  const sendMessage = async () => {
    const Messages = Moralis.Object.extend("Messages");
    const newMessage = new Messages();

    if (selectedFile) {
      const base64 = selectedFile;
      const file = new Moralis.File("image.png", { base64 });
      await file.saveIPFS();
      newMessage.set("image", file);
    }

    newMessage.save({
      message: message,
      sender: messageSender,
      receiver: messageReceiver,
    }).then((message) => {
      console.log("New message created with objectId: " + message.id);
      console.log("receiver :", message.get("receiver"));
    },

    (error) => {
      console.log(error.message);
    });

    setMessage("");
    setSelectedFile(null)
    setShowEmojis(false)
  }


  async function getMessages() {
    const data = await fetch(`/api/api-getMyMessages?sender=${messageSender}&receiver=${messageReceiver}`)
    .then((res) => res.json())
    .then((json) => setMessageData(json))

    return data
  }

  useEffect(() => {
    getMessages()
  }, [messageReceiver])

  useEffect(() => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  }, [messageData]);

    
  return (
    <div className="chatbox">
      {messageData && messageData.map((message) => (
        <Message
          key={message.id}
          message={message}
          messageSender={messageSender}
          messageReceiver={messageReceiver}
        />
      ))}

      <div ref={endOfMessages}></div>
      <div className="inbox__message__footer">
        <form className='inbox__message__input'>
          <input type="text" value={message} placeholder={`Type a message to ${truncateReceiverAddress}`} onChange={e => setMessage(e.target.value)} />
          <div className="inbox__message__input__icons">
            <BsEmojiSmile size={24} className="inbox__message__input__icon" onClick={() => setShowEmojis(!showEmojis)} />
            <IoImagesOutline size={24} className="inbox__message__input__icon" onClick={() => filePickerRef.current.click()} name="image"/>
            <input
              type="file"
              ref={filePickerRef}
              hidden
              onChange={addImageToPost}
            />
            {selectedFile && (
              <div className="inbox__message__input__file">
                <div
                  onClick={() => setSelectedFile(null)}
                  className="inbox__message__input__file__remove"
                >
                  <FiX size={24} />
                </div>
                <img
                  src={selectedFile}
                  alt=""
                  className=""
                />
            </div>
            )}
            {showEmojis && (
              <div className="inbox__message__input__picker">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  theme="dark"
                />
              </div>
            )}
          </div>
          <button type='submit' onClick={sendMessage} disabled={!message.trim()}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Messages;