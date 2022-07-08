import React from "react";
import TemplateItem from "./template-item";

function OfferTemplates(props) {
  return (
    <div className="offerTemplateMain">
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
          formShowFn={props.formShowFn}
        />
      ))}
    </div>
  );
}

export default OfferTemplates;
