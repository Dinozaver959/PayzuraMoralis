import React, { useState, useEffect, useRef } from "react";
import { useMoralis } from "react-moralis";
import{ BsEmojiSmile } from "react-icons/bs";
import { IoImagesOutline } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const SendMessage = (props) => {
  const { Moralis } = useMoralis();
  const { currentAccount, userAddress, endOfMessages } = props;
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false)
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null)
  const truncateAccountAddress = currentAccount ? currentAccount.slice(0, 5) + "..." + currentAccount.slice(-4) : "";

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

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message) return;

    const Messages = Moralis.Object.extend("Messages");
    const messages = new Messages();
    
    messages.save({
      message: message,
      sender: currentAccount,
      receiver: userAddress,
      image: selectedFile,
    }).then((message) => {
      console.log("New message created with objectId: " + message.id);
      // console.log("receiver :", message.get("receiver"));
    },
    (error) => {
      console.log(error.message);
    });


    setMessage("");
    setSelectedFile(null)
    setShowEmojis(false)
    scrollToBottom();
  }

  useEffect(() => {
    scrollToBottom();
  } , [message]);

  const scrollToBottom = () => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="inbox__message__footer">
      <form className='inbox__message__input'>
        <input type="text" value={message} placeholder={`Type a message ${truncateAccountAddress}`} onChange={e => setMessage(e.target.value)} />
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
  )
}

export default SendMessage