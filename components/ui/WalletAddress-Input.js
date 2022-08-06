import React, { createRef, Fragment } from "react";
import CloseIc from "../icons/Close";
import PlusIc from "../icons/Plus";

function WalletAddressField(props) {
  const { inputValue, setInputValue, errorValue, setErrorValue } = props;
  let textInput = createRef();

  const handleAddWallet = (e) => {
    let enteredValue = textInput.current.value;
    if (enteredValue.length !== 0) {
      if (enteredValue.length !== 42 || enteredValue.match(/^0x/i) === null) {
        setErrorValue(true);
      } else {
        setErrorValue(false);
        setInputValue([...inputValue, enteredValue]);
        textInput.current.value = "";
      }
    } else {
      setErrorValue(false);
    }
  };
  
  const handleRemoveWallet = (index) => {
    setInputValue([
      ...inputValue.slice(0, index),
      ...inputValue.slice(index + 1, inputValue.length),
    ]);
  };

  return (
    <Fragment>
      <div className="walletInputParent">
        <div className="interedValidatedWallets">
          {inputValue.map((chip, i) => (
            <div className="walletChip" key={i}>
              <span>{chip}</span>
              <i>
                <CloseIc size={16} onClick={() => handleRemoveWallet(i)} />
              </i>
            </div>
          ))}
        </div>
        <div className="fieldWithPlus">
          <input
            className="walletInputField"
            type="text"
            placeholder="Wallets..."
            ref={textInput}
            onBlur={handleAddWallet}
          />
          <PlusIc size={16} onClick={handleAddWallet} />
        </div>
      </div>
    </Fragment>
  );
}

export default WalletAddressField;
