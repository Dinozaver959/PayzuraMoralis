import RightArrowIc from "../icons/RightArrow";
import Button from "../ui/Button";

function TemplateItem(props) {
  const {
    title,
    description,
    id,
    value,
    radioChangeFn,
    selectedTemplate,
    formShowFn,
  } = props;

  return (
    <div
      className={
        selectedTemplate === value ? "offerCard selected" : "offerCard"
      }
    >
      <input
        name="offerCardTemplates"
        value={value}
        type="radio"
        onChange={radioChangeFn}
        defaultChecked={selectedTemplate === value}
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
          {selectedTemplate === value ? (
            <Button
              classes="button secondary rounded withIcon"
              onClick={formShowFn}
            >
              <span>Continue</span>
              <i>
                <RightArrowIc />
              </i>
            </Button>
          ) : (
            <div className="button rounded primary">
              <span>Select Template</span>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

export default TemplateItem;
