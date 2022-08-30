import { useState } from "react";
import Button from "./Button";

function TabsUi(props) {
  const { titles, details } = props;
  const [contentDisplay, setContentDisplay] = useState(0);
  return (
    <div className="TabsUiMain">
      <ul className="headerTabs">
        {titles.map((item, index) => (
          <li key={index} className={contentDisplay !== index ? "tabItem" : "tabItem active"}>
            <Button type="button" onClick={() => setContentDisplay(index)}>{item}</Button>
          </li>
        ))}
      </ul>
      <div className="tabsContainerMain">
        {details.map((detail, index) => (
          <div
            className={contentDisplay !== index ? "tabContent hide" : "tabContent"}
            key={index}
          >
            {detail}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabsUi;
