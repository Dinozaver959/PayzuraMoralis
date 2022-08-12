import { Tooltip } from "@mui/material";
// import { useEffect } from "react";

function RadioGroup(props) {
  const { values, selectedRadio, setSelectedRadio } = props;

  // useEffect(() => {
  //   radioChangehandler(selectedRadio);
  // }, [selectedRadio]);

  return (
    <div className={props.listItem === "radioList" ? "radioListMain" : "radioGroupMain"}>
      {values.map((item, index) => (
        <div key={index} className="radioItem">
          {item.availability ? (
            <input
              type="radio"
              className="radioInput"
              name={item.name}
              id={item.name + index}
              value={item.label}
              checked={selectedRadio === item.value}
              onChange={() => setSelectedRadio(item.value)}
            />
          ) : (
            <input
              type="radio"
              className="radioInput"
              name={item.name}
              id={item.name + index}
              value={item.label}
              checked={selectedRadio === item.value}
              onChange={() => setSelectedRadio(item.value)}
              disabled={true}
            />
          )}
          {item.tooltip ? (
            <Tooltip
              title={item.tooltip}
              placement="top"
              enterTouchDelay={0}
              arrow
            >
              <label className="radioLabel" htmlFor={item.name + index}>
                {item.label}
              </label>
            </Tooltip>
          ) : (
            <label className="radioLabel" htmlFor={item.name + index}>
              {item.label}
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;
