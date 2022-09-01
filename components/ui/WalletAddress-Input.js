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
    resetField,
    register,
  } = props;
  const [addrText, setAddrText] = React.useState("");

  const handleAddWallet = (e) => {
    let txtInput = document.getElementById(name + "inputText"); // e.target;
    let enteredValue = txtInput.value;

    if (enteredValue.length !== 0) {
      if (
        enteredValue.match(/^0x[a-fA-F0-9]{40}$/g) === null ||
        Web3.utils.isAddress(enteredValue) === false
      ) {
        setErrorValue(true);
      } else {
        setErrorValue(false);
        setInputValue([...inputValue, enteredValue]);
      }
      setAddrText("");
      resetField(name);
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
            {inputValue.map(
              (chip, i) =>
                chip !== "" && (
                  <div className="walletChip" key={i}>
                    <span>{chip}</span>
                    <i>
                      <CloseIc
                        size={16}
                        onClick={() => handleRemoveWallet(i)}
                      />
                    </i>
                  </div>
                )
            )}
          </div>
        )}
        <div className="fieldWithPlus">
          {props.isRequire ? (
            <input
              className="walletInputField"
              type="text"
              placeholder="Wallets..."
              id={name + "inputText"}
              value={addrText}
              {...register(name, {
                required: inputValue.length <= 0,
                pattern: /^0x[a-fA-F0-9]{40}$/g,
                onBlur: handleAddWallet,
                onChange: (e) => setAddrText(e.target.value),
              })}
            />
          ) : (
            <input
              className="walletInputField"
              type="text"
              placeholder="Wallets..."
              id={name + "inputText"}
              onBlur={handleAddWallet}
              value={addrText}
              onChange={(e) => setAddrText(e.target.value)}
            />
          )}
          <PlusIc size={16} onClick={handleAddWallet} />
        </div>
      </div>
    </Fragment>
  );
}

export default WalletAddressField;
