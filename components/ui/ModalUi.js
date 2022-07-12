import Button from "./Button";

function ModalUi(props) {
  return props.content.show ? (
    <div className="modalMain">
      <div className="modalContainer">
        <div className="modalBox">
          <div className="modalHeader">
            <h5>{props.content.title}</h5>
            <Button classes="linkButton">x</Button>
          </div>
          <div className="modalBody">{props.content.message}</div>
          <div className="modalFooter">
            <Button classes="button default rounded">Close</Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ModalUi;
