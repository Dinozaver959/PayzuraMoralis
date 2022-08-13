import React, { Fragment, useState } from "react";

function SelectDropdown(props) {
  const { options } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
    console.log(selectedOption);
  };

  return (
    <Fragment>
      <div className="selectDropdown">
        <div className="selectedOption" onClick={toggling}>
          {selectedOption || "All"}
        </div>
        {isOpen && (
          <div className="dropdownContainer">
            <div className="dropdownList">
              {options.map((option) => (
                <div
                  className="dropdownListItems"
                  onClick={onOptionClicked(option.value)}
                  key={Math.random()}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default SelectDropdown;
