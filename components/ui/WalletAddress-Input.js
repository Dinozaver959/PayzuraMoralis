import React, { createRef, Fragment } from "react";
import CloseIc from "../icons/Close";
import PlusIc from "../icons/Plus";

const Web3 = require("web3");

function WalletAddressField(props) {
  const {
    name,
    inputValue,
    setInputValue,
    setErrorValue,
    register,
  } = props;
  let textInput = createRef();

  const handleAddWallet = (e) => {
    let txtInput = e.target;
    let enteredValue = txtInput.value;

    if (enteredValue.length !== 0) {
      if (
        enteredValue.match(/^0x[a-fA-F0-9]{40}$/g) === null ||
        Web3.utils.isAddress(enteredValue) === false
      ) {
        setErrorValue(true);
        txtInput.value = "";
      } else {
        setErrorValue(false);
        setInputValue([...inputValue, enteredValue]);
        txtInput.value = "";
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
        {inputValue && (
          <div className="enteredValidatedWallets">
            {inputValue.map((chip, i) => (
              <div className="walletChip" key={i}>
                <span>{chip}</span>
                <i>
                  <CloseIc size={16} onClick={() => handleRemoveWallet(i)} />
                </i>
              </div>
            ))}
          </div>
        )}
        <div className="fieldWithPlus">
          {props.isRequire ? (
            <input
              className="walletInputField"
              type="text"
              placeholder="Wallets..."
              ref={textInput}
              {...register(name, {
                required: true,
                pattern: /^0x[a-fA-F0-9]{40}$/g,
                onBlur: handleAddWallet,
              })}
            />
          ) : (
            <input
              className="walletInputField"
              type="text"
              placeholder="Wallets..."
              ref={textInput}
              onBlur={handleAddWallet}
            />
          )}
          <PlusIc size={16} onClick={handleAddWallet} />
        </div>
      </div>
    </Fragment>
  );
}

export default WalletAddressField;
