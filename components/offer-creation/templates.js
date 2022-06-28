import React from "react";
import TemplateItem from "./template-item";
import PlusIc from "./../icons/Plus";

function OfferTemplates(props) {
  return (
    <div className="offerTemplateMain">
      {/* <input type="text" /> */}
      <div
        className={
          props.selectedTemplate === "blank"
            ? "offerCard selected"
            : "offerCard"
        }
      >
        <input
          name="offerCardTemplates"
          value="blank"
          type="radio"
          onChange={props.radioChangeFn}
          defaultChecked={props.selectedTemplate === "blank"}
          id="blankTemplate"
        />
        <label htmlFor="blankTemplate">
          <div className="offerCardBody">
            <div className="blankCard">
              <i>
                <PlusIc />
              </i>
              <div className="cardLabel">Use Blank Description</div>
            </div>
          </div>
        </label>
      </div>

      {props.TemplatesData.map((item) => (
        <TemplateItem
          key={item.id}
          id={item.id}
          title={item.templateName}
          description={item.templateDescription}
          value={item.templateCode}
          selectedTemplate={props.selectedTemplate}
          setSelectedTemplate={props.setSelectedTemplate}
          radioChangeFn={props.radioChangeFn}
        />
      ))}
    </div>
  );
}

export default OfferTemplates;
