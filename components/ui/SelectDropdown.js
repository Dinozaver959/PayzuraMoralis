import React, { Fragment, useState } from "react";

function SelectDropdown(props) {
  const { options, selectedOption, setSelectedOption } = props;

  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
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
