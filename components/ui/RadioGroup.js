import { useState } from "react";

function RadioGroup(props) {
  const { values } = props;
  const [selectedRadio, setSelectedRadio] = useState(false);

  return (
    <div>
      selected is {selectedRadio}
      {values.map((item, index) => (
        <div key={index}>
          <label htmlFor={item.name}>{item.value}</label>
          <input
            type="radio"
            name={item.name}
            id={item.name}
            value={item.label}
            checked={selectedRadio === item.value}
            onChange={() => setSelectedRadio(item.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;
