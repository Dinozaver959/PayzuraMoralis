import React from "react";
import TemplateItem from "./template-item";

function ContractTemplates(props) {
  return (
    <div className="contractTemplateMain">
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

export default ContractTemplates;
