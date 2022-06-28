function TemplateItem(props) {
  const { title, description, id, value } = props;

  return (
    <div
      className={
        props.selectedTemplate === value ? "offerCard selected" : "offerCard"
      }
    >
      <input
        name="offerCardTemplates"
        value={value}
        type="radio"
        onChange={props.radioChangeFn}
        defaultChecked={props.selectedTemplate === value}
        id={id}
      />
      <label htmlFor={id}>
        <div className="offerCardHeader">{title}</div>
        <div className="offerCardBody">
          <div className="offerBodyRow">
            <div className="labelData">Description</div>
            <div className="valueData">{description}</div>
          </div>
        </div>
        <div className="offerCardFooter">
          <div
            className={
              props.selectedTemplate === value
                ? "button rounded primary"
                : "button rounded secondary"
            }
          >
            {props.selectedTemplate === value ? "Selected" : "Select Template"}
          </div>
        </div>
      </label>
    </div>
  );
}

export default TemplateItem;
